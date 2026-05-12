import { Preference } from "@/src/domain/models";
import { deleteJson, getJson, listJson, upsertJson } from "@/src/db/repositories/baseRepo";
import { decryptObjectFields, encryptObjectFields } from "@/src/services/encryption";

const sensitiveFields: (keyof Preference)[] = ["value"];

export const preferenceRepo = {
  async get(id: string): Promise<Preference | null> {
    const preference = await getJson<Preference>("preferences", id);
    return preference ? decryptObjectFields(preference, sensitiveFields) : null;
  },
  async list(partnerId?: string): Promise<Preference[]> {
    const preferences = await listJson<Preference>("preferences", partnerId ? "WHERE partner_id = ?" : "", partnerId ? [partnerId] : []);
    return Promise.all(preferences.map((preference) => decryptObjectFields(preference, sensitiveFields)));
  },
  async save(preference: Preference): Promise<void> {
    const stored = preference.isSensitive ? await encryptObjectFields(preference, sensitiveFields) : preference;
    await upsertJson("preferences", stored, { partner_id: preference.partnerId, is_sensitive: preference.isSensitive ? 1 : 0 });
  },
  delete: (id: string) => deleteJson("preferences", id)
};
