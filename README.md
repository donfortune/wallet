Wallet Provider Event API
=========================

A small Node.js/TypeScript wallet API built as part of a backend engineering take-home assessment.

The API receives transaction events from a payment provider, keeps track of transaction state, and updates a customer's wallet balance only when a transaction becomes successful.

I intentionally kept the implementation small and focused on the requirements of the exercise rather than trying to build a complete production banking system.

Quick Start
-----------

### 1\. Install dependencies

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install   `

### 2\. Build the project

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run build   `

### 3\. Start the API

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm start   `

The API will be available at:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   http://localhost:3000   `

### 4\. Check the seeded wallet

Open another terminal and run:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl http://localhost:3000/wallets/W001   `

You should get a response similar to:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "walletId": "W001",    "customerId": "C001",    "availableBalanceKobo": 0,    "currency": "NGN",    "transactions": []  }   `

### 5\. Send a test provider event

Create a pending transaction:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl -X POST http://localhost:3000/provider/events \    -H "Content-Type: application/json" \    -d '{      "eventId": "E001",      "transactionRef": "T001",      "walletId": "W001",      "amountKobo": 250000,      "currency": "NGN",      "status": "pending"    }'   `

Then mark the transaction as successful:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl -X POST http://localhost:3000/provider/events \    -H "Content-Type: application/json" \    -d '{      "eventId": "E002",      "transactionRef": "T001",      "walletId": "W001",      "amountKobo": 250000,      "currency": "NGN",      "status": "successful"    }'   `

Check the wallet again:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl http://localhost:3000/wallets/W001   `

The balance should now be:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   250000 kobo   `

which represents:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ₦2,500   `

### 6\. Run the tests

Because the tests use the compiled JavaScript files in dist, build before running the tests:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run build  npm test   `

Expected result:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Test Files  1 passed  Tests       10 passed   `

1\. What I Built
----------------

The API supports two main operations:

*   Receiving provider transaction events
    
*   Retrieving a wallet and its transaction history
    

The main financial rule is:

> A wallet should only be credited once for a successful transaction, regardless of how many times the provider sends the event.

The implementation uses:

*   **Node.js**
    
*   **TypeScript**
    
*   **Express**
    
*   **SQLite**
    
*   **better-sqlite3**
    
*   **Vitest**
    
*   **Supertest**
    

The production environment described in the assessment uses NestJS and PostgreSQL, but SQLite was permitted for this exercise, so I used it to keep the project manageable and focus on the transaction and idempotency logic.

2\. Architecture
----------------

The application is intentionally simple:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML                 `Payment Provider                          |                          | POST /provider/events                          v                Provider Event Service                          |                +---------+---------+                |                   |                v                   v         provider_events       transactions                                    |                                    | successful                                    v                                 wallets                                    |                                    |                                    v                           GET /wallets/:walletId`

There are three main database tables:

### wallets

Stores the current wallet balance.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   wallet_id: W001  customer_id: C001  balance_kobo: 250000  currency: NGN   `

### transactions

Stores the internal state of a financial transaction.

A transaction is identified by transaction\_ref.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   T001  250000 kobo  NGN  successful   `

### provider\_events

Stores incoming provider events.

This gives the application an audit trail of what events it has received.

This distinction is important because:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   eventId        = identity of a particular provider event  transactionRef = identity of the underlying transaction   `

The same transaction can therefore be represented by more than one provider event without causing the wallet to be credited more than once.

3\. API Endpoints
-----------------

### POST /provider/events

Receives a provider transaction event.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "eventId": "E001",    "transactionRef": "T001",    "walletId": "W001",    "amountKobo": 250000,    "currency": "NGN",    "status": "pending"  }   `

Supported statuses:

*   pending
    
*   successful
    
*   failed
    

The API accepts deposits only.

### GET /wallets/:walletId

Returns the wallet balance and transaction history.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "walletId": "W001",    "customerId": "C001",    "availableBalanceKobo": 250000,    "currency": "NGN",    "transactions": [      {        "transaction_ref": "T001",        "amount_kobo": 250000,        "currency": "NGN",        "status": "successful"      }    ]  }   `

4\. Transaction Behaviour
-------------------------

### Pending transaction

A pending transaction is recorded but does not increase the wallet balance.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   T001 → pending  Balance → 0   `

### Successful transaction

If a pending transaction later becomes successful:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   T001 → successful  Balance → +250000   `

### Failed transaction

A failed transaction is recorded but does not affect the wallet balance.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   T002 → failed  Balance → unchanged   `

### Terminal states

Once a transaction becomes either:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   successful  failed   `

its financial state cannot be changed by a later provider event.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   T001 → successful   `

followed by:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   T001 → pending   `

will not change the transaction back to pending.

5\. Idempotency
---------------

Idempotency was one of the main areas I focused on because duplicate provider events can cause incorrect wallet balances.

There are two cases handled by the implementation.

### Duplicate event ID

If the exact same eventId is received again, the application recognises that the event has already been processed.

It does not credit the wallet again.

### Different event IDs with the same transaction reference

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   E001 → T001 → successful → ₦2,500  E002 → T001 → successful → ₦2,500   `

The second event does not create another credit because T001 already exists as a successful transaction.

This means the wallet remains:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ₦2,500   `

rather than incorrectly becoming:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ₦5,000   `

6\. Data Validation
-------------------

The API currently validates:

*   Required event fields
    
*   Positive integer amountKobo
    
*   NGN currency
    
*   Supported transaction status
    
*   Existing wallet
    
*   Wallet/event currency consistency
    
*   Conflicting eventId details
    
*   Conflicting transactionRef details
    

For example, the following is rejected:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "amountKobo": -100000  }   `

A transaction reference cannot also be reused with a different amount.

7\. Atomic Wallet Updates
-------------------------

When a transaction moves from pending to successful, three things happen:

1.  The transaction status is updated.
    
2.  The wallet balance is increased.
    
3.  The provider event is recorded.
    

These operations are performed inside a SQLite transaction.

Conceptually:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   BEGIN TRANSACTION  Update transaction → successful  Update wallet      → +amount  Record event  COMMIT   `

If an error occurs during the operation, the transaction can roll back rather than leaving only part of the financial state updated.

8\. Testing
-----------

I created automated tests covering the main requirements from the assessment.

The current test suite contains **10 tests**, including:

*   Seeded wallet
    
*   Pending transaction
    
*   Pending → successful
    
*   Duplicate event replay
    
*   Duplicate transaction reference
    
*   Failed transaction
    
*   Late pending event
    
*   Negative amount
    
*   Conflicting transaction details
    
*   Conflicting event ID
    

Current result:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Test Files  1 passed  Tests       10 passed   `

### A note about AI assistance

I want to be transparent about this because it is part of how I completed the assessment.

I used AI assistance extensively while working through the test implementation, and the automated test file was largely written with AI assistance.

I did not treat the generated tests as automatically correct. I ran them against the application, investigated the failures I encountered, corrected the test setup/import issues, and verified that the final test suite passes.

One issue I encountered was that the existing application mounts its routes in server.ts, while my initial tests imported app.ts directly. This resulted in 404 responses during testing.

I also initially tried importing the TypeScript route files directly, but the project's CommonJS/export-assignment setup caused issues with the test runner. I eventually used the compiled JavaScript files in dist for the test setup.

I am including this because I would rather accurately describe how the work was completed than give the impression that every line was written entirely without assistance.

9\. My Experience With the Stack
--------------------------------

I am more comfortable with **MongoDB-based backend development** than I am with SQLite.

I have also worked with Node.js and Express before, but I would not describe myself as highly experienced with the Express ecosystem yet. I am still building confidence with parts of the Node.js backend stack, particularly database transactions and relational database design.

Because of that, this assessment required me to learn some concepts while implementing the solution.

In particular, I had to spend time understanding:

*   SQLite transactions
    
*   Relational database constraints
    
*   Idempotency
    
*   Transaction state transitions
    
*   The difference between an event ID and a transaction reference
    
*   How to prevent duplicate financial credits
    
*   Testing an Express API with Supertest and Vitest
    

I consider this part of the value of the exercise for me. I was able to take a stack I am less comfortable with, understand the requirements, research the areas I did not know well, and produce a working implementation.

10\. Concurrency and Production Considerations
----------------------------------------------

The current implementation uses SQLite because it was permitted by the assessment.

For a production wallet system using PostgreSQL, I would strengthen the implementation with database-level guarantees.

For example:

*   Unique constraints on event\_id
    
*   Unique constraints on transaction\_ref
    
*   PostgreSQL transactions
    
*   Appropriate row-level locking
    
*   Appropriate transaction isolation
    
*   Stronger database-level validation constraints
    

The important principle is that idempotency should not depend only on application-level checks.

For example, two requests could theoretically arrive at almost exactly the same time:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Request A → checks T001 → does not exist  Request B → checks T001 → does not exist   `

Both requests could then attempt to credit the wallet.

A production implementation should therefore use database constraints and transactional locking/isolation as an additional line of defence.

I would not consider the current SQLite implementation equivalent to a production PostgreSQL wallet system. It is a deliberately small implementation for this assessment.

11\. What Happens if the Database Fails?
----------------------------------------

The successful transaction flow is wrapped in a database transaction.

The intention is that:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   transaction update          +  wallet update          +  provider event record   `

either succeed together or roll back together.

This reduces the possibility of a situation where the wallet is credited but the transaction state was not recorded.

In a production system, I would also consider:

*   Database monitoring
    
*   Retry behaviour
    
*   Durable event processing
    
*   Reconciliation
    
*   Alerting
    
*   Operational audit logs
    

12\. Webhook Authenticity
-------------------------

This exercise focuses on processing the provider event itself.

The current implementation does **not** implement provider webhook signature verification.

In a production system, I would expect the provider to supply a mechanism such as a signed webhook.

I would verify:

*   Webhook signature
    
*   Timestamp/freshness where applicable
    
*   Event ID/replay protection
    
*   Provider-specific authentication requirements
    

I would also avoid trusting arbitrary client-supplied wallet IDs or amounts without validating them against trusted provider data.

13\. Reconciliation
-------------------

A wallet system should not rely entirely on the event ingestion endpoint.

If there is a mismatch between the provider's records and the internal system, I would first perform a read-only investigation.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Provider records         |         v  Internal provider events         |         v  Internal transactions         |         v  Wallet balance   `

I would compare the records and collect evidence before making a correction.

If a correction is required, I would expect an approval process and an audit trail rather than simply changing the wallet balance manually.

Similarly, if the provider reports a successful transaction that is missing internally, I would investigate the missing event/transaction first and use a controlled recovery process rather than blindly replaying or overwriting data.

14\. Assumptions
----------------

For this exercise I assumed:

*   Only deposit transactions are required.
    
*   The wallet currency is NGN.
    
*   amountKobo is always represented as an integer.
    
*   eventId identifies a provider event.
    
*   transactionRef identifies the underlying financial transaction.
    
*   successful and failed are terminal transaction states.
    
*   SQLite is acceptable for the exercise, as stated in the assessment.
    
*   Authentication was outside the scope of the exercise.
    

15\. Known Limitations
----------------------

This is an assessment implementation rather than a production-ready wallet service.

Some limitations include:

*   SQLite instead of PostgreSQL
    
*   No webhook signature verification
    
*   No authentication/authorization
    
*   No rate limiting
    
*   No distributed processing/queue
    
*   Basic HTTP error handling
    
*   No dedicated reconciliation job
    
*   No production monitoring/alerting
    
*   Application-level validation is stronger than the current database constraints
    
*   Tests currently use the compiled dist output because of the project's TypeScript/CommonJS setup
    

These are areas I would address before using a system like this for real financial transactions.

16\. What I Would Improve Next
------------------------------

If I had more time, my next improvement would be moving the persistence layer to **PostgreSQL** and making the financial invariants enforceable at the database level.

I would then add:

1.  PostgreSQL transactions
    
2.  Unique constraints
    
3.  Row-level locking where required
    
4.  Webhook signature verification
    
5.  More comprehensive integration tests
    
6.  Reconciliation tooling
    
7.  Structured logging and monitoring
    

I would prefer doing these in that order rather than adding infrastructure that does not directly improve financial correctness.

17\. Running the Project
------------------------

### Install dependencies

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install   `

### Build the TypeScript project

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run build   `

### Start the compiled application

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm start   `

The server runs on:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   http://localhost:3000   `

### Development mode

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run dev   `

### Run tests

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm test   `

The current tests use the compiled files in dist, so run:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run build  npm test   `

before running the test suite after making source changes.

18\. Example Requests
---------------------

### Create a pending transaction

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl -X POST http://localhost:3000/provider/events \    -H "Content-Type: application/json" \    -d '{      "eventId": "E001",      "transactionRef": "T001",      "walletId": "W001",      "amountKobo": 250000,      "currency": "NGN",      "status": "pending"    }'   `

### Mark the transaction successful

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl -X POST http://localhost:3000/provider/events \    -H "Content-Type: application/json" \    -d '{      "eventId": "E002",      "transactionRef": "T001",      "walletId": "W001",      "amountKobo": 250000,      "currency": "NGN",      "status": "successful"    }'   `

### Check the wallet

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl http://localhost:3000/wallets/W001   `

Expected balance:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   250000 kobo   `

which represents:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ₦2,500   `

19\. Project Structure
----------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   src/  ├── controller/  │   ├── providerEventController.ts  │   └── walletController.ts  ├── routes/  │   ├── providerEventRoutes.ts  │   └── walletRoutes.ts  ├── services/  │   ├── providerEventService.ts  │   └── walletService.ts  ├── types/  │   └── index.ts  ├── app.ts  ├── db.ts  └── server.ts  tests/  └── wallet.test.ts   `

The project follows a simple controller → service → database structure.

I intentionally kept the structure relatively small because the assessment did not require a larger architectural framework.

20\. Time and Learning
----------------------

I spent time not only implementing the endpoints but also understanding the financial rules behind them.

The most useful part of the exercise for me was working through the difference between:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   "the API received an event"   `

and:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   "the wallet should actually be credited"   `

That distinction led to the separate handling of provider events, transaction state, and wallet balance.

It also helped me understand why idempotency is especially important in financial systems.

21\. AI and Documentation Used
------------------------------

I used AI assistance and documentation during the assessment.

AI was particularly useful for:

*   Understanding unfamiliar SQLite concepts
    
*   Troubleshooting TypeScript/test-runner issues
    
*   Structuring the automated tests
    
*   Thinking through edge cases
    
*   Reviewing the implementation against the assessment requirements
    

As mentioned above, the test suite was largely written with AI assistance.

I personally ran the application, ran the tests, investigated failures, made the necessary project-specific adjustments, and verified the final behaviour.

I have intentionally documented this because I believe it is important to distinguish between using AI as a development aid and claiming that all implementation work was produced independently.

22\. Final Status
-----------------

The implementation currently:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Build       PASS  Tests       10/10 PASS  Wallet API  Working  Event API   Working  Idempotency Implemented  Atomicity   Implemented for transaction updates   `

The solution is intentionally modest, but it demonstrates the core behaviour requested by the assessment while identifying the areas that would need to be strengthened for a real production financial system.

Author
------

**Don Fortune Tangban**

Backend / DevOps Engineering

This project was completed as part of a backend engineering internship assessment.