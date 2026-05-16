import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import { runMigrations } from "@/src/db/migrations";
import { isWebDatabaseLockError } from "@/src/db/webDatabaseLock";

let dbPromise: Promise<SQLite.SQLiteDatabase> | undefined;
let usingVolatileWebDatabase = false;

async function openAndMigrate(databaseName: string): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(databaseName);
  await runMigrations(db);
  return db;
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openAndMigrate("partnerops.db").catch(async (error) => {
      if (Platform.OS === "web" && isWebDatabaseLockError(error)) {
        usingVolatileWebDatabase = true;
        console.warn(
          "PartnerOps web database is locked by another browser context. Using an in-memory database for this preview tab.",
          error
        );
        return openAndMigrate(":memory:");
      }

      dbPromise = undefined;
      throw error;
    });
  }
  return dbPromise;
}

export function isUsingVolatileWebDatabase(): boolean {
  return usingVolatileWebDatabase;
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
