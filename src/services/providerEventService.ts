import db from "../db";

exports.processProviderEvent = (event: any) => {
    try {
        const {
            eventId,
            transactionRef,
            walletId,
            amountKobo,
            currency,
            status,
        } = event;

        // 1. Validate required fields
        if (
            !eventId ||
            !transactionRef ||
            !walletId ||
            amountKobo === undefined ||
            !currency ||
            !status
        ) {
            throw new Error("Missing required event fields");
        }

        // 2. Validate amount
        if (!Number.isInteger(amountKobo) || amountKobo <= 0) {
            throw new Error("amountKobo must be a positive integer");
        }

        // 3. Validate currency
        if (currency !== "NGN") {
            throw new Error("Currency must be NGN");
        }

        // 4. Validate status
        if (!["pending", "successful", "failed"].includes(status)) {
            throw new Error("Invalid transaction status");
        }

        // 5. Check that the wallet exists
        const wallet = db
            .prepare(`
                SELECT wallet_id, currency
                FROM wallets
                WHERE wallet_id = ?
            `)
            .get(walletId) as
            | {
                wallet_id: string;
                currency: string;
            }
            | undefined;

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        // Make sure the event currency matches the wallet currency
        if (wallet.currency !== currency) {
            throw new Error("Event currency does not match wallet currency");
        }

        // 6. Check if this event has already been received
        const existingEvent = db
            .prepare(`
                SELECT
                    event_id,
                    transaction_ref,
                    wallet_id,
                    amount_kobo,
                    currency,
                    status
                FROM provider_events
                WHERE event_id = ?
            `)
            .get(eventId) as
            | {
                event_id: string;
                transaction_ref: string;
                wallet_id: string;
                amount_kobo: number;
                currency: string;
                status: string;
            }
            | undefined;

        if (existingEvent) {
            // Same eventId must not be reused with
            // different financial details.
            const eventConflicts =
                existingEvent.transaction_ref !== transactionRef ||
                existingEvent.wallet_id !== walletId ||
                existingEvent.amount_kobo !== amountKobo ||
                existingEvent.currency !== currency;

            if (eventConflicts) {
                throw new Error(
                    "Event ID already exists with conflicting transaction details"
                );
            }

            // Legitimate replay: do nothing.
            return {
                message: "Event already processed",
            };
        }

        // 7. Check whether the transaction already exists
        const existingTransaction = db
            .prepare(`
                SELECT
                    transaction_ref,
                    wallet_id,
                    amount_kobo,
                    currency,
                    status
                FROM transactions
                WHERE transaction_ref = ?
            `)
            .get(transactionRef) as
            | {
                transaction_ref: string;
                wallet_id: string;
                amount_kobo: number;
                currency: string;
                status: string;
            }
            | undefined;

        // 8. Existing transaction
        if (existingTransaction) {

            // Make sure the financial transaction details
            // haven't changed.
            if (
                existingTransaction.wallet_id !== walletId ||
                existingTransaction.amount_kobo !== amountKobo ||
                existingTransaction.currency !== currency
            ) {
                throw new Error(
                    "Transaction details conflict with existing transaction"
                );
            }

            // Terminal transactions cannot be changed.
            if (
                existingTransaction.status === "successful" ||
                existingTransaction.status === "failed"
            ) {
                db.prepare(`
                    INSERT INTO provider_events (
                        event_id,
                        transaction_ref,
                        wallet_id,
                        amount_kobo,
                        currency,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                `).run(
                    eventId,
                    transactionRef,
                    walletId,
                    amountKobo,
                    currency,
                    status
                );

                return {
                    message: "Transaction already finalized",
                };
            }

            // Pending → pending
            if (
                existingTransaction.status === "pending" &&
                status === "pending"
            ) {
                db.prepare(`
                    INSERT INTO provider_events (
                        event_id,
                        transaction_ref,
                        wallet_id,
                        amount_kobo,
                        currency,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                `).run(
                    eventId,
                    transactionRef,
                    walletId,
                    amountKobo,
                    currency,
                    status
                );

                return {
                    message: "Transaction remains pending",
                };
            }

            // Pending → failed
            if (
                existingTransaction.status === "pending" &&
                status === "failed"
            ) {
                const transaction = db.transaction(() => {

                    db.prepare(`
                        UPDATE transactions
                        SET status = ?, updated_at = CURRENT_TIMESTAMP
                        WHERE transaction_ref = ?
                    `).run(status, transactionRef);

                    db.prepare(`
                        INSERT INTO provider_events (
                            event_id,
                            transaction_ref,
                            wallet_id,
                            amount_kobo,
                            currency,
                            status
                        )
                        VALUES (?, ?, ?, ?, ?, ?)
                    `).run(
                        eventId,
                        transactionRef,
                        walletId,
                        amountKobo,
                        currency,
                        status
                    );
                });

                transaction();

                return {
                    message: "Transaction marked as failed",
                };
            }

            // Pending → successful
            if (
                existingTransaction.status === "pending" &&
                status === "successful"
            ) {
                const transaction = db.transaction(() => {

                    db.prepare(`
                        UPDATE transactions
                        SET status = ?, updated_at = CURRENT_TIMESTAMP
                        WHERE transaction_ref = ?
                    `).run(status, transactionRef);

                    db.prepare(`
                        UPDATE wallets
                        SET balance_kobo = balance_kobo + ?
                        WHERE wallet_id = ?
                    `).run(amountKobo, walletId);

                    db.prepare(`
                        INSERT INTO provider_events (
                            event_id,
                            transaction_ref,
                            wallet_id,
                            amount_kobo,
                            currency,
                            status
                        )
                        VALUES (?, ?, ?, ?, ?, ?)
                    `).run(
                        eventId,
                        transactionRef,
                        walletId,
                        amountKobo,
                        currency,
                        status
                    );
                });

                transaction();

                return {
                    message: "Transaction successful and wallet credited",
                };
            }
        }

        // 9. New transaction
        const transaction = db.transaction(() => {

            db.prepare(`
                INSERT INTO transactions (
                    transaction_ref,
                    wallet_id,
                    amount_kobo,
                    currency,
                    status
                )
                VALUES (?, ?, ?, ?, ?)
            `).run(
                transactionRef,
                walletId,
                amountKobo,
                currency,
                status
            );

            // Only successful transactions immediately
            // increase the wallet balance.
            if (status === "successful") {
                db.prepare(`
                    UPDATE wallets
                    SET balance_kobo = balance_kobo + ?
                    WHERE wallet_id = ?
                `).run(amountKobo, walletId);
            }

            // Always record the provider event for traceability.
            db.prepare(`
                INSERT INTO provider_events (
                    event_id,
                    transaction_ref,
                    wallet_id,
                    amount_kobo,
                    currency,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(
                eventId,
                transactionRef,
                walletId,
                amountKobo,
                currency,
                status
            );
        });

        transaction();

        return {
            message: "Provider event processed successfully",
        };

    } catch (error) {
        console.error("Error processing provider event:", error);
        throw error;
    }
};