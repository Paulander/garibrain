import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { Field, Panel, Pill, PrimaryButton, Screen, SectionTitle, colors } from "@/src/components/ui";
import { Idea } from "@/src/domain/models";
import { generatePanicIdeas, PanicRequest } from "@/src/domain/panicGenerator";
import { ideaRepo } from "@/src/db/repositories/ideaRepo";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { preferenceRepo } from "@/src/db/repositories/preferenceRepo";
import { settingsRepo } from "@/src/db/repositories/settingsRepo";

export default function PanicScreen() {
  const [budget, setBudget] = useState<PanicRequest["budget"]>("medium");
  const [timeline, setTimeline] = useState<PanicRequest["timeline"]>("one_week");
  const [occasion, setOccasion] = useState("Anniversary");
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useFocusEffect(useCallback(() => {
    setIdeas([]);
  }, []));

  async function generate() {
    const [partner] = await partnerRepo.list();
    if (!partner) return;
    const [preferences, settings] = await Promise.all([preferenceRepo.list(partner.id), settingsRepo.get()]);
    const generated = generatePanicIdeas({
      partnerId: partner.id,
      budget,
      timeline,
      type: "gift",
      tone: "practical",
      useSavedPreferences: true,
      toneMode: settings?.toneMode ?? "standard"
    }, preferences);
    setIdeas(generated.map((idea) => ({ ...idea, title: `${idea.title} for ${occasion}` })));
  }

  async function saveIdea(idea: Idea) {
    await ideaRepo.save({ ...idea, saved: true, updatedAt: new Date().toISOString() });
  }

  return (
    <Screen>
      <SectionTitle title="Panic Helper" subtitle="Decent plans, fast, using what you saved." />
      <Panel>
        <Field label="Occasion" value={occasion} onChangeText={setOccasion} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["low", "medium", "high", "unknown"] as const).map((option) => (
            <Pill key={option} label={option} selected={budget === option} onPress={() => setBudget(option)} />
          ))}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["today", "few_days", "one_week", "two_plus_weeks"] as const).map((option) => (
            <Pill key={option} label={option.replace("_", " ")} selected={timeline === option} onPress={() => setTimeline(option)} />
          ))}
        </View>
        <PrimaryButton label="Start panic mode" onPress={generate} />
      </Panel>
      {ideas.map((idea) => (
        <Panel key={idea.id}>
          <Text style={{ color: colors.ink, fontWeight: "800", fontSize: 17 }}>{idea.title}</Text>
          <Text style={{ color: colors.ink, lineHeight: 21 }}>{idea.description}</Text>
          <Text style={{ color: colors.muted, lineHeight: 21 }}>Why: {idea.whyItFits}</Text>
          <Text style={{ color: colors.muted, lineHeight: 21 }}>Next: {idea.nextStep}</Text>
          <PrimaryButton label="Save idea" onPress={() => saveIdea(idea)} />
        </Panel>
      ))}
    </Screen>
  );
}
