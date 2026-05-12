import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { CalendarDays, ClipboardList, Menu, Plus, ShieldCheck } from "lucide-react-native";
import { AdviceCard } from "@/src/components/AdviceCard";
import { SupportWindowCard } from "@/src/components/SupportWindowCard";
import { BrandMark, Metric, Panel, Pill, PrimaryButton, RowItem, Screen, SectionTitle, colors } from "@/src/components/ui";
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
  const [counts, setCounts] = useState({ watch: 0, blockers: 0, followUps: 0, intel: 0 });

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
      const generatedCards = generateAdviceCards({
        today,
        toneMode: settings?.toneMode ?? "standard",
        events,
        preferences,
        supportWindows: windows,
        debriefs,
        ideas
      });
      setCards(generatedCards);
      setCounts({
        watch: generatedCards.filter((card) => card.priority === "high" || card.priority === "medium").length,
        blockers: generatedCards.filter((card) => card.priority === "urgent").length,
        followUps: debriefs.filter((debrief) => debrief.followUpAt).length,
        intel: preferences.length
      });
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []));

  return (
    <Screen>
      <SectionTitle
        eyebrow="Today"
        title="Today"
        subtitle={subtitle}
        right={<BrandMark size={44} />}
      />
      <Panel tone="elevated">
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: colors.ivory, fontSize: 16, fontWeight: "800" }}>Day Snapshot</Text>
          <Text style={{ color: colors.muted2, fontSize: 11 }}>Updated now</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 0 }}>
          <Metric value={counts.watch} label="Watch Items" tone="amber" />
          <Metric value={counts.blockers} label="Blockers" tone="red" />
          <Metric value={counts.followUps} label="Follow Ups" tone="sage" />
          <Metric value={counts.intel} label="Intel Saved" tone="info" />
        </View>
      </Panel>
      {supportWindow ? <SupportWindowCard window={supportWindow} /> : null}
      <Panel>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: colors.ivory, fontSize: 16, fontWeight: "800" }}>Current Briefing</Text>
          <Pill label={cards.length ? "active" : "clear"} tone={cards.length ? "watch" : "success"} />
        </View>
        <RowItem
          icon={<CalendarDays color={colors.sage} size={22} />}
          title="Calendar-bound advice first"
          meta="Upcoming dates, support windows, and debrief follow-ups drive this screen."
        />
      </Panel>
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
          <RowItem
            icon={<ShieldCheck color={colors.sage} size={22} />}
            title="Nothing urgent yet."
            meta="Add dates, preferences, or support patterns so PartnerOps can actually help."
          />
          <PrimaryButton label="Add first date" onPress={() => router.push("/calendar" as never)} />
        </Panel>
      )}
      <Panel>
        <Text style={{ color: colors.ivory, fontWeight: "800", fontSize: 16 }}>Quick Capture</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <PrimaryButton label="Add Intel" onPress={() => router.push("/memory" as never)} />
          <PrimaryButton label="New Debrief" onPress={() => router.push("/debrief/new" as never)} />
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Menu color={colors.muted2} size={18} />
          <ClipboardList color={colors.muted2} size={18} />
          <Plus color={colors.sage} size={20} />
          <Text style={{ color: colors.muted2, fontSize: 12 }}>Private ops log, not a surveillance file.</Text>
        </View>
      </Panel>
    </Screen>
  );
}
