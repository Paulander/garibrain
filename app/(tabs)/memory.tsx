import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { PreferenceCard } from "@/src/components/PreferenceCard";
import { Field, Panel, Pill, PrimaryButton, Screen, SectionTitle } from "@/src/components/ui";
import { Importance, Preference, Sentiment } from "@/src/domain/models";
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
      tags: [],
      isSensitive: false,
      createdAt: now,
      updatedAt: now
    });
    setValue("");
    await load();
  }

  return (
    <Screen>
      <SectionTitle title="Memory" subtitle="Store useful details without turning it into a complaint log." />
      <Panel>
        <Field label="Title" value={title} onChangeText={setTitle} />
        <Field label="Category" value={category} onChangeText={setCategory} />
        <Field label="Details" value={value} onChangeText={setValue} placeholder="Wants to go to Greece" />
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
