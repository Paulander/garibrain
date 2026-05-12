import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text } from "react-native";
import { AdviceCard } from "@/src/components/AdviceCard";
import { SupportWindowCard } from "@/src/components/SupportWindowCard";
import { Panel, PrimaryButton, Screen, SectionTitle, colors } from "@/src/components/ui";
import { generateAdviceCards } from "@/src/domain/adviceEngine";
import { activeOrUpcomingSupportWindow, generateCycleSupportWindows, SupportWindow } from "@/src/domain/cycleEngine";
import { settingsRepo } from "@/src/db/repositories/settingsRepo";
import { eventRepo } from "@/src/db/repositories/eventRepo";
import { preferenceRepo } from "@/src/db/repositories/preferenceRepo";
import { cycleSettingsRepo, supportPatternRepo } from "@/src/db/repositories/supportRepo";
import { debriefRepo } from "@/src/db/repositories/debriefRepo";
import { ideaRepo } from "@/src/db/repositories/ideaRepo";
import { todayISO } from "@/src/utils/dates";
import { todaySubtitle } from "@/src/utils/tone";

export default function TodayScreen() {
  const [cards, setCards] = useState<ReturnType<typeof generateAdviceCards>>([]);
  const [supportWindow, setSupportWindow] = useState<SupportWindow | undefined>();
  const [subtitle, setSubtitle] = useState("Here's what matters today.");

  useFocusEffect(useCallback(() => {
    let mounted = true;
    async function load() {
      const today = todayISO();
      const settings = await settingsRepo.get();
      const [events, preferences, cycles, supportPatterns, debriefs, ideas] = await Promise.all([
        eventRepo.list(),
        preferenceRepo.list(),
        cycleSettingsRepo.list(),
        supportPatternRepo.list(),
        debriefRepo.list(),
        ideaRepo.list()
      ]);
      const cycleWindows = cycles.flatMap((cycle) => generateCycleSupportWindows(cycle, today, 60));
      const manualWindows: SupportWindow[] = supportPatterns.map((pattern) => ({
        id: pattern.id,
        partnerId: pattern.partnerId,
        kind: "pre_period",
        label: pattern.name,
        startDate: pattern.startDate,
        endDate: pattern.endDate ?? pattern.startDate,
        confidence: pattern.confidence,
        supportActions: pattern.supportActions
      }));
      const windows = [...cycleWindows, ...manualWindows];
      if (!mounted) return;
      setSubtitle(todaySubtitle(settings?.toneMode ?? "standard"));
      setSupportWindow(activeOrUpcomingSupportWindow(windows, today));
      setCards(generateAdviceCards({
        today,
        toneMode: settings?.toneMode ?? "standard",
        events,
        preferences,
        supportWindows: windows,
        debriefs,
        ideas
      }));
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []));

  return (
    <Screen>
      <SectionTitle title="Today's Ops" subtitle={subtitle} />
      {supportWindow ? <SupportWindowCard window={supportWindow} /> : null}
      {cards.length ? (
        cards.map((card) => (
          <AdviceCard
            key={card.id}
            card={card}
            onAction={card.actionRoute ? () => router.push(card.actionRoute as never) : undefined}
          />
        ))
      ) : (
        <Panel>
          <Text style={{ color: colors.ink, fontWeight: "800", fontSize: 18 }}>Nothing urgent yet.</Text>
          <Text style={{ color: colors.muted, lineHeight: 22 }}>Add dates, preferences, or support patterns so PartnerOps can actually help.</Text>
          <PrimaryButton label="Add first date" onPress={() => router.push("/calendar" as never)} />
        </Panel>
      )}
    </Screen>
  );
}
