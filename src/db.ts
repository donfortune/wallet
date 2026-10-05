import Database from "better-sqlite3";

const db = new Database("data/wallet.db");


db.pragma("foreign_keys = ON");


db.exec(`
  CREATE TABLE IF NOT EXISTS wallets (
    wallet_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    balance_kobo INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    transaction_ref TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    amount_kobo INTEGER NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (wallet_id) REFERENCES wallets(wallet_id)
  );

  CREATE TABLE IF NOT EXISTS provider_events (
    event_id TEXT PRIMARY KEY,
    transaction_ref TEXT NOT NULL,
    wallet_id TEXT NOT NULL,
    amount_kobo INTEGER NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (wallet_id) REFERENCES wallets(wallet_id)
  );
`);


const seedWallet = db.prepare(`
  INSERT OR IGNORE INTO wallets (
    wallet_id,
    customer_id,
    balance_kobo,
    currency
  )
  VALUES (?, ?, ?, ?)
`);

seedWallet.run("W001", "C001", 0, "NGN");

export default db;