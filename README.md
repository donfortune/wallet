````
# Wallet Provider Event API

A small Node.js/TypeScript wallet API.

The API receives transaction events from a payment provider, keeps track of transaction state, and updates a customer's wallet balance only when a transaction becomes successful.

I intentionally kept the implementation small and focused on the requirements of the exercise rather than trying to build a complete production banking system.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
````

### 2\. Build the project

Bash

```
npm run build
```

### 3\. Start the API

Bash

```
npm start
```

The API will be available at:

Plaintext

```
http://localhost:3000
```

### 4\. Check the seeded wallet

Open another terminal and run:

Bash

```
curl http://localhost:3000/wallets/W001
```

You should get a response similar to:

JSON

```
{
  "walletId": "W001",
  "customerId": "C001",
  "availableBalanceKobo": 0,
  "currency": "NGN",
  "transactions": []
}
```

### 5\. Send a test provider event

Create a pending transaction:

Bash

```
curl -X POST http://localhost:3000/provider/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "E001",
    "transactionRef": "T001",
    "walletId": "W001",
    "amountKobo": 250000,
    "currency": "NGN",
    "status": "pending"
  }'
```

Then mark the transaction as successful:

Bash

```
curl -X POST http://localhost:3000/provider/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "E002",
    "transactionRef": "T001",
    "walletId": "W001",
    "amountKobo": 250000,
    "currency": "NGN",
    "status": "successful"
  }'
```

Check the wallet again:

Bash

```
curl http://localhost:3000/wallets/W001
```

The balance should now be `250000 kobo`, which represents `₦2,500`.

### 6\. Run the tests

Because the tests use the compiled JavaScript files in `dist`, build before running the tests:

Bash

```
npm run build
npm test
```

Expected result:

Plaintext

```
Test Files  1 passed
Tests       10 passed
```

## 1\. What I Built

The API supports two main operations:

-   Receiving provider transaction events

-   Retrieving a wallet and its transaction history

The main financial rule is:

> A wallet should only be credited once for a successful transaction, regardless of how many times the provider sends the event.

The implementation uses:

-   **Node.js**

-   **TypeScript**

-   **Express**

-   **SQLite**

-   **better-sqlite3**

-   **Vitest**

-   **Supertest**

The production environment described in the assessment uses NestJS and PostgreSQL, but SQLite was permitted for this exercise, so I used it to keep the project manageable and focus on the transaction and idempotency logic.

## 2\. Architecture

The application is intentionally simple:

Plaintext

```
Payment Provider
        |
        | POST /provider/events
        v
Provider Event Service
        |
+-------+---------+
|                 |
v                 v
provider_events   transactions
                  |
                  | successful
                  v
                wallets
                  |
                  v
            GET /wallets/:walletId
```

There are three main database tables:

### wallets

Stores the current wallet balance.

-   `wallet_id`: `W001`

-   `customer_id`: `C001`

-   `balance_kobo`: `250000`

-   `currency`: `NGN`

### transactions

Stores the internal state of a financial transaction identified by `transaction_ref`.

-   Example: `T001` | `250000 kobo` | `NGN` | `successful`

### provider\_events

Stores incoming provider events, giving the application an audit trail of received events. This distinction is important because:

-   `eventId` \= identity of a particular provider event

-   `transactionRef` \= identity of the underlying transaction

The same transaction can therefore be represented by more than one provider event without causing the wallet to be credited more than once.

## 3\. API Endpoints

### POST /provider/events

Receives a provider transaction event.

JSON

```
{
  "eventId": "E001",
  "transactionRef": "T001",
  "walletId": "W001",
  "amountKobo": 250000,
  "currency": "NGN",
  "status": "pending"
}
```

Supported statuses: `pending`, `successful`, `failed`. The API accepts deposits only.

### GET /wallets/:walletId

Returns the wallet balance and transaction history.

JSON

```
{
  "walletId": "W001",
  "customerId": "C001",
  "availableBalanceKobo": 250000,
  "currency": "NGN",
  "transactions": [
    {
      "transaction_ref": "T001",
      "amount_kobo": 250000,
      "currency": "NGN",
      "status": "successful"
    }
  ]
}
```

## 4\. Transaction Behaviour

-   **Pending transaction:** Recorded but does not increase the wallet balance (`T001 → pending` | `Balance → 0`).

-   **Successful transaction:** If a pending transaction later becomes successful, balance increases (`T001 → successful` | `Balance → +250000`).

-   **Failed transaction:** Recorded but does not affect the wallet balance (`T002 → failed` | `Balance → unchanged`).

-   **Terminal states:** Once a transaction becomes either `successful` or `failed`, its financial state cannot be changed by a later provider event (e.g., `T001 → successful` followed by `T001 → pending` will not change the transaction back).

## 5\. Idempotency

Idempotency was one of the main areas I focused on because duplicate provider events can cause incorrect wallet balances.

-   **Duplicate event ID:** If the exact same `eventId` is received again, the application recognises it has already been processed and does not credit the wallet again.

-   **Different event IDs with the same transaction reference:**

    -   `E001` → `T001` → `successful` → `₦2,500`

    -   `E002` → `T001` → `successful` → `₦2,500` (ignored for credit)

    The second event does not create another credit because `T001` already exists as a successful transaction, keeping the balance at `₦2,500` rather than incorrectly becoming `₦5,000`.

## 6\. Data Validation

The API currently validates:

-   Required event fields

-   Positive integer `amountKobo`

-   `NGN` currency

-   Supported transaction status

-   Existing wallet

-   Wallet/event currency consistency

-   Conflicting `eventId` details

-   Conflicting `transactionRef` details

For example, negative amounts (e.g., `"amountKobo": -100000`) are rejected, and a transaction reference cannot be reused with a different amount.

## 7\. Atomic Wallet Updates

When a transaction moves from pending to successful, three things happen atomically:

1.  The transaction status is updated.

2.  The wallet balance is increased.

3.  The provider event is recorded.

These operations are performed inside a SQLite transaction:

Plaintext

```
BEGIN TRANSACTION
  Update transaction → successful
  Update wallet      → +amount
  Record event
COMMIT
```

If an error occurs, the transaction rolls back rather than leaving only part of the financial state updated.

## 8\. Testing

The current test suite contains **10 tests**, covering:

-   Seeded wallet

-   Pending transaction

-   Pending → successful

-   Duplicate event replay

-   Duplicate transaction reference

-   Failed transaction

-   Late pending event

-   Negative amount

-   Conflicting transaction details

-   Conflicting event ID

Result: `Test Files 1 passed | Tests 10 passed`

### A note about AI assistance

I want to be transparent about using AI assistance extensively while working through the test implementation, and the automated test file was largely written with AI assistance. I did not treat generated tests as automatically correct—I ran them against the application, investigated failures, corrected test setup/import issues, and verified that the final test suite passes.

One issue encountered was that the application mounts its routes in `server.ts`, while initial tests imported `app.ts`directly, resulting in `404` responses. Additionally, importing TypeScript route files directly caused issues with CommonJS/export-assignment in the test runner, so tests use the compiled JavaScript files in `dist`.

## 9\. My Experience With the Stack

I am more comfortable with **MongoDB-based backend development** than I am with SQLite. While I have worked with Node.js and Express before, I am still building confidence with database transactions and relational database design.

This assessment required me to learn concepts on the fly, including:

-   SQLite transactions

-   Relational database constraints

-   Idempotency

-   Transaction state transitions

-   Distinguishing between event IDs and transaction references

-   Preventing duplicate financial credits

-   Testing an Express API with Supertest and Vitest

## 10\. Concurrency and Production Considerations

The current implementation uses SQLite because it was permitted by the assessment. For a production wallet system using PostgreSQL, I would strengthen implementation with database-level guarantees:

-   Unique constraints on `event_id` and `transaction_ref`

-   PostgreSQL transactions with appropriate row-level locking and isolation levels

-   Stronger database-level validation constraints

In high-concurrency scenarios, two requests arriving simultaneously could both check a transaction, see it doesn't exist, and attempt to credit the wallet. Production systems must rely on database constraints and transactional locking as a primary defense line rather than application checks alone.

## 11\. What Happens if the Database Fails?

The successful transaction flow is wrapped in a database transaction so that transaction updates, wallet updates, and event records either succeed together or roll back together. In production, I would also layer on:

-   Database monitoring and retry behavior

-   Durable event processing queues

-   Reconciliation and alerting

-   Operational audit logs

## 12\. Webhook Authenticity

The current implementation focuses on processing the event itself and does **not** implement provider webhook signature verification. In production, I would expect:

-   Webhook signature validation

-   Timestamp/freshness checks

-   Replay protection via event IDs

-   Strict validation against trusted provider data rather than trusting arbitrary client-supplied IDs or amounts.

## 13\. Reconciliation

A wallet system should not rely entirely on event ingestion endpoints. If there is a mismatch between provider records and internal systems:

1.  Perform read-only investigation comparing provider records, internal events, transactions, and wallet balances.

2.  Collect evidence before making corrections.

3.  Require an approval process and audit trail for manual corrections rather than directly overwriting wallet balances.

## 14\. Assumptions

-   Only deposit transactions are required.

-   Wallet currency is `NGN`.

-   `amountKobo` is always an integer.

-   `eventId` identifies a provider event; `transactionRef` identifies the underlying financial transaction.

-   `successful` and `failed` are terminal transaction states.

-   SQLite is acceptable for the exercise.

-   Authentication was outside the scope of the exercise.

## 15\. Known Limitations

-   Uses SQLite instead of PostgreSQL

-   No webhook signature verification

-   No authentication/authorization

-   No rate limiting

-   No distributed processing/queue

-   Basic HTTP error handling

-   No dedicated reconciliation job

-   No production monitoring/alerting

-   Tests rely on compiled `dist` output due to TypeScript/CommonJS setup

## 16\. What I Would Improve Next

If given more time, my next priority is moving the persistence layer to **PostgreSQL** and enforcing financial invariants at the database level, followed by:

1.  PostgreSQL transactions & unique constraints

2.  Row-level locking

3.  Webhook signature verification

4.  Comprehensive integration tests

5.  Reconciliation tooling

6.  Structured logging and monitoring


## 17\. Project Structure

Plaintext

```
src/
├── controller/
│   ├── providerEventController.ts
│   └── walletController.ts
├── routes/
│   ├── providerEventRoutes.ts
│   └── walletRoutes.ts
├── services/
│   ├── providerEventService.ts
│   └── walletService.ts
├── types/
│   └── index.ts
├── app.ts
├── db.ts
└── server.ts
tests/
└── wallet.test.ts
```
