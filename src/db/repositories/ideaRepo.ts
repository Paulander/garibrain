import { Idea } from "@/src/domain/models";
import { deleteJson, getJson, listJson, upsertJson } from "@/src/db/repositories/baseRepo";

export const ideaRepo = {
  get: (id: string) => getJson<Idea>("ideas", id),
  list: (partnerId?: string) => listJson<Idea>("ideas", partnerId ? "WHERE partner_id = ?" : "", partnerId ? [partnerId] : []),
  save: (idea: Idea) => upsertJson("ideas", idea, { partner_id: idea.partnerId, occasion_event_id: idea.occasionEventId ?? null, saved: idea.saved ? 1 : 0 }),
  delete: (id: string) => deleteJson("ideas", id)
};
