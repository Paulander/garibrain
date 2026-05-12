import { Partner } from "@/src/domain/models";
import { deleteJson, getJson, listJson, upsertJson } from "@/src/db/repositories/baseRepo";

export const partnerRepo = {
  get: (id: string) => getJson<Partner>("partners", id),
  list: () => listJson<Partner>("partners"),
  save: (partner: Partner) => upsertJson("partners", partner),
  delete: (id: string) => deleteJson("partners", id)
};
