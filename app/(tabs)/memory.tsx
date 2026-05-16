import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { BookmarkPlus, Lightbulb, Search } from "lucide-react-native";
import { PreferenceCard } from "@/src/components/PreferenceCard";
import { Field, Metric, Panel, Pill, PrimaryButton, RowItem, Screen, SectionTitle, colors } from "@/src/components/ui";
import { Importance, Preference, Sentiment } from "@/src/domain/models";
import { CapturePrompt, nextCapturePrompts } from "@/src/domain/promptCoach";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { preferenceRepo } from "@/src/db/repositories/preferenceRepo";
import { id, nowUtcISO } from "@/src/utils/dates";

export default function MemoryScreen() {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [title, setTitle] = useState("Gift hint");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("Gift ideas");
  const [sentiment, setSentiment] = useState<Sentiment>("wants");
  const [importance, setImportance] = useState<Importance>("medium");
  const [selectedPrompt, setSelectedPrompt] = useState<CapturePrompt | undefined>();

  const load = useCallback(async () => {
    setPreferences(await preferenceRepo.list());
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  async function savePreference() {
    const [partner] = await partnerRepo.list();
    if (!partner) return;
    const now = nowUtcISO();
    await preferenceRepo.save({
      id: id("preference"),
      partnerId: partner.id,
      category,
      title,
      value: value || "Capture the actual detail here",
      sentiment,
      importance,
      source: "user_note",
      tags: selectedPrompt?.tags ?? [],
      isSensitive: selectedPrompt?.isSensitive ?? false,
      createdAt: now,
      updatedAt: now
    });
    setValue("");
    setSelectedPrompt(undefined);
    await load();
  }

  function applyPrompt(prompt: CapturePrompt) {
    setSelectedPrompt(prompt);
    setTitle(prompt.fieldTitle);
    setCategory(prompt.fieldCategory);
    setValue("");
    setSentiment(prompt.sentiment);
    setImportance(prompt.importance);
  }

  const prompts = nextCapturePrompts(preferences, 5);

  return (
    <Screen>
      <SectionTitle
        eyebrow="Memory"
        title="Memory"
        subtitle="Store useful details without turning it into a complaint log."
        right={<Search color={colors.sage} size={30} />}
      />
      <Panel tone="elevated">
        <Text style={{ color: colors.ivory, fontWeight: "800", fontSize: 16 }}>Intel Snapshot</Text>
        <View style={{ flexDirection: "row" }}>
          <Metric value={preferences.length} label="Intel Saved" tone="sage" />
          <Metric value={preferences.filter((pref) => pref.sentiment === "dislikes").length} label="Dislikes" tone="red" />
          <Metric value={preferences.filter((pref) => pref.importance === "critical").length} label="Critical" tone="amber" />
        </View>
      </Panel>
      <Panel>
        <RowItem
          icon={<Lightbulb color={colors.amber} size={22} />}
          title="Prompt Coach"
          meta="Use a prompt when your brain offers exactly nothing useful."
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {prompts.map((prompt) => (
            <Pill
              key={prompt.id}
              label={prompt.title}
              selected={selectedPrompt?.id === prompt.id}
              onPress={() => applyPrompt(prompt)}
              tone={prompt.importance === "critical" ? "blocker" : prompt.importance === "high" ? "watch" : "info"}
            />
          ))}
        </View>
        {selectedPrompt ? (
          <Text style={{ color: colors.muted2, lineHeight: 21 }}>
            {selectedPrompt.detailHint}
          </Text>
        ) : null}
        <RowItem
          icon={<BookmarkPlus color={colors.sage} size={22} />}
          title="Quick Capture"
          meta="A single useful note beats a heroic memory performance."
        />
        <Field label="Title" value={title} onChangeText={setTitle} />
        <Field label="Category" value={category} onChangeText={setCategory} />
        <Field label="Details" value={value} onChangeText={setValue} placeholder={selectedPrompt?.placeholder ?? "Wants to go to Greece"} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["likes", "dislikes", "wants", "needs", "important", "neutral"] as const).map((option) => (
            <Pill key={option} label={option} selected={sentiment === option} onPress={() => setSentiment(option)} />
          ))}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["low", "medium", "high", "critical"] as const).map((option) => (
            <Pill key={option} label={option} selected={importance === option} onPress={() => setImportance(option)} />
          ))}
        </View>
        <PrimaryButton label="Quick capture" onPress={savePreference} />
      </Panel>
      {preferences.map((preference) => <PreferenceCard key={preference.id} preference={preference} />)}
    </Screen>
  );
}
