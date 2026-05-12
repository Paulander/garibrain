import { getDatabase } from "@/src/db/database";

export interface JsonRow {
  id: string;
  data: string;
}

export async function upsertJson(table: string, entity: { id: string; createdAt: string; updatedAt: string }, extraColumns: Record<string, string | number | null> = {}): Promise<void> {
  const db = await getDatabase();
  const columns = ["id", "data", "created_at", "updated_at", ...Object.keys(extraColumns)];
  const placeholders = columns.map(() => "?").join(", ");
  const updates = columns.filter((column) => column !== "id").map((column) => `${column}=excluded.${column}`).join(", ");
  const values = [
    entity.id,
    JSON.stringify(entity),
    entity.createdAt,
    entity.updatedAt,
    ...Object.values(extraColumns)
  ];
  await db.runAsync(
    `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})
     ON CONFLICT(id) DO UPDATE SET ${updates}`,
    values
  );
}

export async function getJson<T>(table: string, id: string): Promise<T | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<JsonRow>(`SELECT id, data FROM ${table} WHERE id = ?`, [id]);
  return row ? JSON.parse(row.data) as T : null;
}

export async function listJson<T>(table: string, where = "", params: (string | number)[] = []): Promise<T[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<JsonRow>(`SELECT id, data FROM ${table} ${where} ORDER BY updated_at DESC`, params);
  return rows.map((row) => JSON.parse(row.data) as T);
}

export async function deleteJson(table: string, id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, [id]);
}
