import { router } from "expo-router";
import { useState } from "react";
import { preferenceRepo } from "@/src/db/repositories/preferenceRepo";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { id, nowUtcISO } from "@/src/utils/dates";
import { Field, Panel, PrimaryButton, Screen, SectionTitle, SecondaryButton } from "@/src/components/ui";

export default function PreferenceStarter() {
  const [title, setTitle] = useState("Favorite chocolate");
  const [value, setValue] = useState("");

  async function save() {
    const [partner] = await partnerRepo.list();
    if (!partner) return router.push("/onboarding/support");
    const now = nowUtcISO();
    await preferenceRepo.save({
      id: id("preference"),
      partnerId: partner.id,
      category: "Chocolate/snacks",
      title,
      value: value.trim() || "Dark chocolate",
      sentiment: "likes",
      importance: "medium",
      source: "user_note",
      tags: ["starter"],
      isSensitive: false,
      createdAt: now,
      updatedAt: now
    });
    router.push("/onboarding/support");
  }

  return (
    <Screen>
      <SectionTitle eyebrow="Setup" title="Add First Detail" subtitle="Start with one useful memory. You can add more later." />
      <Panel>
        <Field label="Title" value={title} onChangeText={setTitle} />
        <Field label="Details" value={value} onChangeText={setValue} placeholder="Dark chocolate, no orange filling" />
        <PrimaryButton label="Add first detail" onPress={save} />
        <SecondaryButton label="Skip for now" onPress={() => router.push("/onboarding/support")} />
      </Panel>
    </Screen>
  );
}
