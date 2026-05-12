import { SQLiteDatabase } from "expo-sqlite";

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS user_settings (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS preferences (
      id TEXT PRIMARY KEY NOT NULL,
      partner_id TEXT NOT NULL,
      data TEXT NOT NULL,
      is_sensitive INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS relationship_events (
      id TEXT PRIMARY KEY NOT NULL,
      partner_id TEXT NOT NULL,
      data TEXT NOT NULL,
      is_sensitive INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY NOT NULL,
      partner_id TEXT NOT NULL,
      event_id TEXT,
      data TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS cycle_settings (
      id TEXT PRIMARY KEY NOT NULL,
      partner_id TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS support_patterns (
      id TEXT PRIMARY KEY NOT NULL,
      partner_id TEXT NOT NULL,
      data TEXT NOT NULL,
      is_sensitive INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS debriefs (
      id TEXT PRIMARY KEY NOT NULL,
      partner_id TEXT NOT NULL,
      data TEXT NOT NULL,
      is_sensitive INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY NOT NULL,
      partner_id TEXT NOT NULL,
      occasion_event_id TEXT,
      data TEXT NOT NULL,
      saved INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}
