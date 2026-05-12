import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { AlertTriangle, CheckCircle2, Clock3, MessageSquareWarning, ShieldCheck, Undo2 } from "lucide-react-native";
import { BrandMark, Field, Panel, Pill, PrimaryButton, RowItem, Screen, SectionTitle, colors } from "@/src/components/ui";
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
      <SectionTitle
        eyebrow="Panic"
        title="Panic"
        subtitle="Decent plans, fast, using what you saved."
        right={<AlertTriangle color={colors.red} size={30} />}
      />
      <Panel tone="danger">
        <Text style={{ color: colors.ivory, fontSize: 20, fontWeight: "800" }}>Panic Button</Text>
        <Text style={{ color: colors.ivory, lineHeight: 21 }}>
          Tap if an occasion is getting close or your plan is still vapor.
        </Text>
        <PrimaryButton label="Generate recovery plan" tone="danger" onPress={generate} />
      </Panel>
      <Panel>
        <Field label="Occasion" value={occasion} onChangeText={setOccasion} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["low", "medium", "high", "unknown"] as const).map((option) => (
            <Pill key={option} label={option} selected={budget === option} onPress={() => setBudget(option)} tone={option === "high" ? "watch" : "info"} />
          ))}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["today", "few_days", "one_week", "two_plus_weeks"] as const).map((option) => (
            <Pill key={option} label={option.replace("_", " ")} selected={timeline === option} onPress={() => setTimeline(option)} tone={option === "today" ? "blocker" : "default"} />
          ))}
        </View>
      </Panel>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Panel style={{ flex: 1, minWidth: 150 }}>
          <RowItem icon={<Clock3 color={colors.sage} size={22} />} title="Delay Tactic" meta="Buy time cleanly." />
        </Panel>
        <Panel style={{ flex: 1, minWidth: 150 }}>
          <RowItem icon={<Undo2 color={colors.sage} size={22} />} title="Exit Strategy" meta="Switch to doable." />
        </Panel>
        <Panel style={{ flex: 1, minWidth: 150 }}>
          <RowItem icon={<MessageSquareWarning color={colors.sage} size={22} />} title="Comm Reset" meta="Say the useful thing." />
        </Panel>
        <Panel style={{ flex: 1, minWidth: 150 }}>
          <RowItem icon={<ShieldCheck color={colors.sage} size={22} />} title="Fact Check" meta="Avoid guessing." />
        </Panel>
      </View>
      <Panel>
        <Text style={{ color: colors.ivory, fontWeight: "800", fontSize: 16 }}>Grounding Checklist</Text>
        {["No partner-blaming language.", "No fake stealth or deception.", "Use saved preferences.", "Prefer fast local options.", "Set the next step."].map((item, index) => (
          <RowItem
            key={item}
            icon={<CheckCircle2 color={index < 3 ? colors.sage : colors.muted} size={18} />}
            title={item}
            meta={index < 3 ? "Ready" : "Check before sending"}
          />
        ))}
      </Panel>
      {ideas.map((idea) => (
        <Panel key={idea.id} tone="elevated">
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <Text style={{ color: colors.ivory, fontWeight: "800", fontSize: 17, flex: 1 }}>{idea.title}</Text>
            <BrandMark size={30} />
          </View>
          <Text style={{ color: colors.ivory, lineHeight: 21 }}>{idea.description}</Text>
          <Text style={{ color: colors.muted2, lineHeight: 21 }}>Why: {idea.whyItFits}</Text>
          <Text style={{ color: colors.muted2, lineHeight: 21 }}>Next: {idea.nextStep}</Text>
          <PrimaryButton label="Save idea" onPress={() => saveIdea(idea)} />
        </Panel>
      ))}
    </Screen>
  );
}
