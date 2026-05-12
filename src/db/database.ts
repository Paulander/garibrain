import * as SQLite from "expo-sqlite";
import { runMigrations } from "@/src/db/migrations";

let dbPromise: Promise<SQLite.SQLiteDatabase> | undefined;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("partnerops.db").then(async (db) => {
      await runMigrations(db);
      return db;
    });
  }
  return dbPromise;
}

export async function initializeDatabase(): Promise<void> {
  await getDatabase();
}

export async function deleteAllLocalData(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    DELETE FROM user_settings;
    DELETE FROM partners;
    DELETE FROM preferences;
    DELETE FROM relationship_events;
    DELETE FROM reminders;
    DELETE FROM cycle_settings;
    DELETE FROM support_patterns;
    DELETE FROM debriefs;
    DELETE FROM ideas;
  `);
}
