import db from "../db";

exports.getWallet = (walletId: string) => {
    try {
        const wallet = db
            .prepare(`
                SELECT wallet_id, customer_id, balance_kobo, currency
                FROM wallets
                WHERE wallet_id = ?
            `)
            .get(walletId) as
            | {
                wallet_id: string;
                customer_id: string;
                balance_kobo: number;
                currency: string;
            }
            | undefined;

        if (!wallet) {
            return null;
        }

        const transactions = db
            .prepare(`
                SELECT
                    transaction_ref,
                    amount_kobo,
                    currency,
                    status
                FROM transactions
                WHERE wallet_id = ?
                ORDER BY created_at DESC
            `)
            .all(walletId);

        return {
            walletId: wallet.wallet_id,
            customerId: wallet.customer_id,
            availableBalanceKobo: wallet.balance_kobo,
            currency: wallet.currency,
            transactions,
        };

    } catch (error) {
        console.error("Error fetching wallet from database:", error);
        throw error;
    }
};