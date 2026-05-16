import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { CheckCircle2, Lightbulb } from "lucide-react-native";
import { Field, Panel, Pill, PrimaryButton, RowItem, Screen, SectionTitle, colors } from "@/src/components/ui";
import { CycleSettings } from "@/src/domain/models";
import { tipsForTags } from "@/src/domain/promptCoach";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { cycleSettingsRepo } from "@/src/db/repositories/supportRepo";
import { id, nowUtcISO, todayISO } from "@/src/utils/dates";

export default function CycleSupportScreen() {
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState(todayISO());
  const [averageCycleLengthDays, setAverageCycleLengthDays] = useState("28");
  const [periodDurationDays, setPeriodDurationDays] = useState("5");
  const [prePeriodSupportDays, setPrePeriodSupportDays] = useState("3");
  const [regularity, setRegularity] = useState<CycleSettings["regularity"]>("somewhat_irregular");
  const [supportActions, setSupportActions] = useState("handle dinner, avoid late-night logistics, no unsolicited advice");
  const [notes, setNotes] = useState("Optional cues: skin flare-ups, low energy, migraines, sleep disruption, wants quiet evenings");

  async function save() {
    const [partner] = await partnerRepo.list();
    if (!partner) return;
    const now = nowUtcISO();
    await cycleSettingsRepo.save({
      id: id("cycle"),
      partnerId: partner.id,
      enabled: true,
      lastPeriodStartDate,
      averageCycleLengthDays: Number.parseInt(averageCycleLengthDays, 10) || 28,
      periodDurationDays: Number.parseInt(periodDurationDays, 10) || 5,
      prePeriodSupportDays: Number.parseInt(prePeriodSupportDays, 10) || 3,
      regularity,
      supportActions: supportActions.split(",").map((action) => action.trim()).filter(Boolean),
      notes,
      notifyDayBefore: true,
      notifyMorningOf: false,
      createdAt: now,
      updatedAt: now
    });
    router.replace("/support");
  }

  const [tip] = tipsForTags(["cycle", "support", "health"], 1);

  return (
    <Screen>
      <SectionTitle eyebrow="Support" title="Cycle Support" subtitle="Manual estimates for care reminders only." />
      <Panel>
        <Text style={{ color: colors.muted2, lineHeight: 22 }}>
          Cycle-based reminders are estimates for support planning only. They are not medical advice and may be inaccurate.
        </Text>
        {tip ? (
          <View style={{ gap: 8 }}>
            <RowItem icon={<Lightbulb color={colors.amber} size={22} />} title={tip.title} meta={tip.body} />
            {tip.do.slice(0, 2).map((item) => (
              <RowItem key={item} icon={<CheckCircle2 color={colors.sage} size={18} />} title={item} />
            ))}
            <Text style={{ color: colors.amber, lineHeight: 21 }}>Avoid: {tip.avoid}</Text>
          </View>
        ) : null}
        <Field label="Last known period start date (YYYY-MM-DD)" value={lastPeriodStartDate} onChangeText={setLastPeriodStartDate} />
        <Field label="Average cycle length days" value={averageCycleLengthDays} onChangeText={setAverageCycleLengthDays} keyboardType="number-pad" />
        <Field label="Period duration days" value={periodDurationDays} onChangeText={setPeriodDurationDays} keyboardType="number-pad" />
        <Field label="Pre-period support days" value={prePeriodSupportDays} onChangeText={setPrePeriodSupportDays} keyboardType="number-pad" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["regular", "somewhat_irregular", "irregular"] as const).map((option) => (
            <Pill key={option} label={option.replace("_", " ")} selected={regularity === option} onPress={() => setRegularity(option)} />
          ))}
        </View>
        <Field label="Support actions" value={supportActions} onChangeText={setSupportActions} />
        <Field label="Pattern notes" value={notes} onChangeText={setNotes} multiline />
        <PrimaryButton label="Save support window" onPress={save} />
      </Panel>
    </Screen>
  );
}
