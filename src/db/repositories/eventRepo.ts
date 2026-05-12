import { RelationshipEvent } from "@/src/domain/models";
import { deleteJson, getJson, listJson, upsertJson } from "@/src/db/repositories/baseRepo";

export const eventRepo = {
  get: (id: string) => getJson<RelationshipEvent>("relationship_events", id),
  list: (partnerId?: string) => listJson<RelationshipEvent>("relationship_events", partnerId ? "WHERE partner_id = ?" : "", partnerId ? [partnerId] : []),
  save: (event: RelationshipEvent) => upsertJson("relationship_events", event, { partner_id: event.partnerId, is_sensitive: event.isSensitive ? 1 : 0 }),
  delete: (id: string) => deleteJson("relationship_events", id)
};
