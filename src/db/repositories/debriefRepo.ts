import { Debrief } from "@/src/domain/models";
import { deleteJson, getJson, listJson, upsertJson } from "@/src/db/repositories/baseRepo";
import { decryptObjectFields, encryptObjectFields } from "@/src/services/encryption";

const fields: (keyof Debrief)[] = ["whatHappened", "whatWorked", "whatBackfired", "myPart", "rememberNextTime"];

export const debriefRepo = {
  async get(id: string): Promise<Debrief | null> {
    const debrief = await getJson<Debrief>("debriefs", id);
    return debrief ? decryptObjectFields(debrief, fields) : null;
  },
  async list(partnerId?: string): Promise<Debrief[]> {
    const debriefs = await listJson<Debrief>("debriefs", partnerId ? "WHERE partner_id = ?" : "", partnerId ? [partnerId] : []);
    return Promise.all(debriefs.map((debrief) => decryptObjectFields(debrief, fields)));
  },
  async save(debrief: Debrief): Promise<void> {
    const stored = debrief.isSensitive ? await encryptObjectFields(debrief, fields) : debrief;
    await upsertJson("debriefs", stored, { partner_id: debrief.partnerId, is_sensitive: debrief.isSensitive ? 1 : 0 });
  },
  delete: (id: string) => deleteJson("debriefs", id)
};
