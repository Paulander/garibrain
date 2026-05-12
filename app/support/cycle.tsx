import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Field, Panel, Pill, PrimaryButton, Screen, SectionTitle, colors } from "@/src/components/ui";
import { CycleSettings } from "@/src/domain/models";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { cycleSettingsRepo } from "@/src/db/repositories/supportRepo";
import { id, nowUtcISO, todayISO } from "@/src/utils/dates";

export default function CycleSupportScreen() {
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState(todayISO());
  const [regularity, setRegularity] = useState<CycleSettings["regularity"]>("somewhat_irregular");

  async function save() {
    const [partner] = await partnerRepo.list();
    if (!partner) return;
    const now = nowUtcISO();
    await cycleSettingsRepo.save({
      id: id("cycle"),
      partnerId: partner.id,
      enabled: true,
      lastPeriodStartDate,
      averageCycleLengthDays: 28,
      periodDurationDays: 5,
      prePeriodSupportDays: 3,
      regularity,
      supportActions: ["handle dinner", "avoid late-night logistics", "no unsolicited advice"],
      notes: "Estimate for support planning only.",
      notifyDayBefore: true,
      notifyMorningOf: false,
      createdAt: now,
      updatedAt: now
    });
    router.replace("/support");
  }

  return (
    <Screen>
      <SectionTitle title="Cycle Support" subtitle="Manual estimates for care reminders only." />
      <Panel>
        <Text style={{ color: colors.muted, lineHeight: 22 }}>
          Cycle-based reminders are estimates for support planning only. They are not medical advice and may be inaccurate.
        </Text>
        <Field label="Last known period start date (YYYY-MM-DD)" value={lastPeriodStartDate} onChangeText={setLastPeriodStartDate} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["regular", "somewhat_irregular", "irregular"] as const).map((option) => (
            <Pill key={option} label={option.replace("_", " ")} selected={regularity === option} onPress={() => setRegularity(option)} />
          ))}
        </View>
        <PrimaryButton label="Save support window" onPress={save} />
      </Panel>
    </Screen>
  );
}
