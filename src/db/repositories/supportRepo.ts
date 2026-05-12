import { CycleSettings, SupportPattern } from "@/src/domain/models";
import { deleteJson, getJson, listJson, upsertJson } from "@/src/db/repositories/baseRepo";

export const cycleSettingsRepo = {
  get: (id: string) => getJson<CycleSettings>("cycle_settings", id),
  list: (partnerId?: string) => listJson<CycleSettings>("cycle_settings", partnerId ? "WHERE partner_id = ?" : "", partnerId ? [partnerId] : []),
  save: (settings: CycleSettings) => upsertJson("cycle_settings", settings, { partner_id: settings.partnerId }),
  delete: (id: string) => deleteJson("cycle_settings", id)
};

export const supportPatternRepo = {
  get: (id: string) => getJson<SupportPattern>("support_patterns", id),
  list: (partnerId?: string) => listJson<SupportPattern>("support_patterns", partnerId ? "WHERE partner_id = ?" : "", partnerId ? [partnerId] : []),
  save: (pattern: SupportPattern) => upsertJson("support_patterns", pattern, { partner_id: pattern.partnerId, is_sensitive: pattern.isSensitive ? 1 : 0 }),
  delete: (id: string) => deleteJson("support_patterns", id)
};
