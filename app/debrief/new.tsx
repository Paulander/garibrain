import { router } from "expo-router";
import { useState } from "react";
import { Field, Panel, PrimaryButton, Screen, SectionTitle } from "@/src/components/ui";
import { debriefRepo } from "@/src/db/repositories/debriefRepo";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { id, nowUtcISO, todayISO } from "@/src/utils/dates";

export default function NewDebriefScreen() {
  const [title, setTitle] = useState("Important conversation");
  const [whatWorked, setWhatWorked] = useState("");
  const [whatBackfired, setWhatBackfired] = useState("");
  const [rememberNextTime, setRememberNextTime] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");

  async function save() {
    const [partner] = await partnerRepo.list();
    if (!partner) return;
    const now = nowUtcISO();
    await debriefRepo.save({
      id: id("debrief"),
      partnerId: partner.id,
      title,
      debriefType: "important_conversation",
      date: todayISO(),
      whatWorked,
      whatBackfired,
      rememberNextTime,
      followUpAt: followUpAt || undefined,
      linkedPreferenceIds: [],
      tags: [],
      isSensitive: true,
      createdAt: now,
      updatedAt: now
    });
    router.back();
  }

  return (
    <Screen>
      <SectionTitle eyebrow="Log" title="Debrief" subtitle="A learning tool, not a complaint log." />
      <Panel>
        <Field label="Title" value={title} onChangeText={setTitle} />
        <Field label="What worked?" value={whatWorked} onChangeText={setWhatWorked} multiline />
        <Field label="What backfired?" value={whatBackfired} onChangeText={setWhatBackfired} multiline />
        <Field label="What should I remember next time?" value={rememberNextTime} onChangeText={setRememberNextTime} multiline />
        <Field label="Follow-up date (YYYY-MM-DD)" value={followUpAt} onChangeText={setFollowUpAt} />
        <PrimaryButton label="Save debrief" onPress={save} />
      </Panel>
    </Screen>
  );
}
