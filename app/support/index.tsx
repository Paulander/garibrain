import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text } from "react-native";
import { SupportWindowCard } from "@/src/components/SupportWindowCard";
import { Panel, PrimaryButton, Screen, SectionTitle, colors } from "@/src/components/ui";
import { generateCycleSupportWindows, SupportWindow } from "@/src/domain/cycleEngine";
import { cycleSettingsRepo, supportPatternRepo } from "@/src/db/repositories/supportRepo";
import { todayISO } from "@/src/utils/dates";

export default function SupportCalendarScreen() {
  const [windows, setWindows] = useState<SupportWindow[]>([]);

  useFocusEffect(useCallback(() => {
    async function load() {
      const today = todayISO();
      const [cycles, patterns] = await Promise.all([cycleSettingsRepo.list(), supportPatternRepo.list()]);
      const cycleWindows = cycles.flatMap((cycle) => generateCycleSupportWindows(cycle, today, 90));
      const manualWindows: SupportWindow[] = patterns.map((pattern) => ({
        id: pattern.id,
        partnerId: pattern.partnerId,
        kind: "pre_period",
        label: pattern.name,
        startDate: pattern.startDate,
        endDate: pattern.endDate ?? pattern.startDate,
        confidence: pattern.confidence,
        supportActions: pattern.supportActions
      }));
      setWindows([...cycleWindows, ...manualWindows].sort((a, b) => a.startDate.localeCompare(b.startDate)));
    }
    void load();
  }, []));

  return (
    <Screen>
      <SectionTitle title="Support Calendar" subtitle="Support planning, not mood prediction." />
      <Panel>
        <Text style={{ color: colors.muted, lineHeight: 22 }}>
          Add support windows for stressful weeks, low-energy days, or recurring patterns. Cycle estimates stay manual and local.
        </Text>
        <PrimaryButton label="Add cycle-based support window" onPress={() => router.push("/support/cycle")} />
        <PrimaryButton label="Add manual support pattern" onPress={() => router.push("/support/pattern")} />
      </Panel>
      {windows.map((window) => <SupportWindowCard key={window.id} window={window} />)}
    </Screen>
  );
}
