import { deleteAllLocalData } from "@/src/db/database";
import { debriefRepo } from "@/src/db/repositories/debriefRepo";
import { eventRepo } from "@/src/db/repositories/eventRepo";
import { ideaRepo } from "@/src/db/repositories/ideaRepo";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { preferenceRepo } from "@/src/db/repositories/preferenceRepo";
import { settingsRepo } from "@/src/db/repositories/settingsRepo";
import { cycleSettingsRepo, supportPatternRepo } from "@/src/db/repositories/supportRepo";

export async function exportLocalData(): Promise<string> {
  const settings = await settingsRepo.get();
  const partners = await partnerRepo.list();
  const preferences = await preferenceRepo.list();
  const events = await eventRepo.list();
  const cycles = await cycleSettingsRepo.list();
  const supportPatterns = await supportPatternRepo.list();
  const debriefs = await debriefRepo.list();
  const ideas = await ideaRepo.list();

  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    settings,
    partners,
    preferences,
    events,
    cycles,
    supportPatterns,
    debriefs,
    ideas
  }, null, 2);
}

export async function deleteEverything(): Promise<void> {
  await deleteAllLocalData();
}
