import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

const walletRoutes = require("../dist/routes/walletRoutes.js");
const providerEventRoutes = require("../dist/routes/providerEventRoutes.js");

const db = require("../dist/db.js").default;

const app = express();

app.use(express.json());

app.use("/wallets", walletRoutes);
app.use("/provider", providerEventRoutes);

describe("Wallet API", () => {
    beforeEach(() => {
        // Reset transaction and event history
        db.prepare("DELETE FROM provider_events").run();
        db.prepare("DELETE FROM transactions").run();

        // Reset wallet balance
        db.prepare(`
            UPDATE wallets
            SET balance_kobo = 0
            WHERE wallet_id = 'W001'
        `).run();
    });

    it("should return the seeded wallet with zero balance", async () => {
        const response = await request(app)
            .get("/wallets/W001");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            walletId: "W001",
            customerId: "C001",
            availableBalanceKobo: 0,
            currency: "NGN",
            transactions: [],
        });
    });

    it("should record a pending transaction without crediting the wallet", async () => {
        const response = await request(app)
            .post("/provider/events")
            .send({
                eventId: "E001",
                transactionRef: "T001",
                walletId: "W001",
                amountKobo: 250000,
                currency: "NGN",
                status: "pending",
            });

        expect(response.status).toBe(200);

        const walletResponse = await request(app)
            .get("/wallets/W001");

        expect(walletResponse.body.availableBalanceKobo).toBe(0);

        expect(walletResponse.body.transactions).toHaveLength(1);

        expect(walletResponse.body.transactions[0]).toEqual({
            transaction_ref: "T001",
            amount_kobo: 250000,
            currency: "NGN",
            status: "pending",
        });
    });

    it("should credit the wallet when a pending transaction becomes successful", async () => {
        await request(app)
            .post("/provider/events")
            .send({
                eventId: "E001",
                transactionRef: "T001",
                walletId: "W001",
                amountKobo: 250000,
                currency: "NGN",
                status: "pending",
            });

        const response = await request(app)
            .post("/provider/events")
            .send({
                eventId: "E002",
                transactionRef: "T001",
                walletId: "W001",
                amountKobo: 250000,
                currency: "NGN",
                status: "successful",
            });

        expect(response.status).toBe(200);

        const walletResponse = await request(app)
            .get("/wallets/W001");

        expect(walletResponse.body.availableBalanceKobo).toBe(250000);

        expect(walletResponse.body.transactions).toHaveLength(1);

        expect(walletResponse.body.transactions[0]).toEqual({
            transaction_ref: "T001",
            amount_kobo: 250000,
            currency: "NGN",
            status: "successful",
        });
    });

    it("should not credit the wallet again when the same eventId is replayed", async () => {
        const event = {
            eventId: "E002",
            transactionRef: "T001",
            walletId: "W001",
            amountKobo: 250000,
            currency: "NGN",
            status: "successful",
        };

        await request(app)
            .post("/provider/events")
            .send(event);

        const replayResponse = await request(app)
            .post("/provider/events")
            .send(event);

        expect(replayResponse.status).toBe(200);

        expect(replayResponse.body).toEqual({
            message: "Event already processed",
        });

        const walletResponse = await request(app)
            .get("/wallets/W001");

        expect(walletResponse.body.availableBalanceKobo).toBe(250000);

        expect(walletResponse.body.transactions).toHaveLength(1);
    });

    it("should not credit the wallet twice when different events use the same transactionRef", async () => {
        await request(app)
            .post("/provider/events")
            .send({
                eventId: "E002",
                transactionRef: "T001",
                walletId: "W001",
                amountKobo: 250000,
                currency: "NGN",
                status: "successful",
            });

        const secondEvent = await request(app)
            .post("/provider/events")
            .send({
                eventId: "E003",
                transactionRef: "T001",
                walletId: "W001",
                amountKobo: 250000,
                currency: "NGN",
                status: "successful",
            });

        expect(secondEvent.status).toBe(200);

        expect(secondEvent.body).toEqual({
            message: "Transaction already finalized",
        });

        const walletResponse = await request(app)
            .get("/wallets/W001");

        expect(walletResponse.body.availableBalanceKobo).toBe(250000);

        expect(walletResponse.body.transactions).toHaveLength(1);
    });

    it("should record a failed transaction without crediting the wallet", async () => {
        await request(app)
            .post("/provider/events")
            .send({
                eventId: "E004",
                transactionRef: "T002",
                walletId: "W001",
                amountKobo: 100000,
                currency: "NGN",
                status: "failed",
            });

        const walletResponse = await request(app)
            .get("/wallets/W001");

        expect(walletResponse.body.availableBalanceKobo).toBe(0);

        expect(walletResponse.body.transactions).toHaveLength(1);

        expect(walletResponse.body.transactions[0]).toEqual({
            transaction_ref: "T002",
            amount_kobo: 100000,
            currency: "NGN",
            status: "failed",
        });
    });

    it("should not move a successful transaction back to pending", async () => {
        await request(app)
            .post("/provider/events")
            .send({
                eventId: "E002",
                transactionRef: "T001",
                walletId: "W001",
                amountKobo: 250000,
                currency: "NGN",
                status: "successful",
            });

        const latePending = await request(app)
            .post("/provider/events")
            .send({
                eventId: "E005",
                transactionRef: "T001",
                walletId: "W001",
                amountKobo: 250000,
                currency: "NGN",
                status: "pending",
            });

        expect(latePending.status).toBe(200);

        expect(latePending.body).toEqual({
            message: "Transaction already finalized",
        });

        const walletResponse = await request(app)
            .get("/wallets/W001");

        expect(walletResponse.body.availableBalanceKobo).toBe(250000);

        expect(walletResponse.body.transactions[0].status).toBe(
            "successful"
        );
    });

    it("should reject a negative amount", async () => {
        const response = await request(app)
            .post("/provider/events")
            .send({
                eventId: "E006",
                transactionRef: "T003",
                walletId: "W001",
                amountKobo: -100000,
                currency: "NGN",
                status: "successful",
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            error: "amountKobo must be a positive integer",
        });
    });

    it("should reject conflicting transaction details", async () => {
        await request(app)
            .post("/provider/events")
            .send({
                eventId: "E007",
                transactionRef: "T004",
                walletId: "W001",
                amountKobo: 100000,
                currency: "NGN",
                status: "successful",
            });

        const response = await request(app)
            .post("/provider/events")
            .send({
                eventId: "E008",
                transactionRef: "T004",
                walletId: "W001",
                amountKobo: 200000,
                currency: "NGN",
                status: "successful",
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            error: "Transaction details conflict with existing transaction",
        });

        const walletResponse = await request(app)
            .get("/wallets/W001");

        expect(walletResponse.body.availableBalanceKobo).toBe(100000);
    });

    it("should reject reuse of an eventId with conflicting details", async () => {
        await request(app)
            .post("/provider/events")
            .send({
                eventId: "E009",
                transactionRef: "T005",
                walletId: "W001",
                amountKobo: 250000,
                currency: "NGN",
                status: "successful",
            });

        const response = await request(app)
            .post("/provider/events")
            .send({
                eventId: "E009",
                transactionRef: "T005",
                walletId: "W001",
                amountKobo: 999999,
                currency: "NGN",
                status: "successful",
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            error: "Event ID already exists with conflicting transaction details",
        });

        const walletResponse = await request(app)
            .get("/wallets/W001");

        expect(walletResponse.body.availableBalanceKobo).toBe(250000);
    });
});
