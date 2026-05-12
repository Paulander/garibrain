import { router } from "expo-router";
import { useState } from "react";
import { Field, Panel, PrimaryButton, Screen, SectionTitle } from "@/src/components/ui";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { supportPatternRepo } from "@/src/db/repositories/supportRepo";
import { id, nowUtcISO, todayISO } from "@/src/utils/dates";

export default function SupportPatternScreen() {
  const [name, setName] = useState("Deadline week");
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [actions, setActions] = useState("handle dinner, avoid surprise plans");

  async function save() {
    const [partner] = await partnerRepo.list();
    if (!partner) return;
    const now = nowUtcISO();
    await supportPatternRepo.save({
      id: id("support"),
      partnerId: partner.id,
      name,
      patternType: "work_stress",
      startDate,
      endDate,
      recurrence: "monthly",
      supportActions: actions.split(",").map((action) => action.trim()).filter(Boolean),
      confidence: "medium",
      isSensitive: false,
      createdAt: now,
      updatedAt: now
    });
    router.replace("/support");
  }

  return (
    <Screen>
      <SectionTitle title="Manual Support Pattern" subtitle="Good for stressful weeks, family obligations, or low-energy stretches." />
      <Panel>
        <Field label="Pattern name" value={name} onChangeText={setName} />
        <Field label="Start date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} />
        <Field label="End date (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} />
        <Field label="Support actions" value={actions} onChangeText={setActions} />
        <PrimaryButton label="Save pattern" onPress={save} />
      </Panel>
    </Screen>
  );
}
