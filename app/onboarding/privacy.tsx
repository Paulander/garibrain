import { router } from "expo-router";
import { View, Text } from "react-native";
import { useState } from "react";
import { PrivacyLevel } from "@/src/domain/models";
import { settingsRepo } from "@/src/db/repositories/settingsRepo";
import { Screen, SectionTitle, Panel, Pill, PrimaryButton, colors } from "@/src/components/ui";

const levels: { label: string; value: PrivacyLevel; body: string }[] = [
  { label: "Private", value: "private", body: "App lock, neutral notifications, quick lock." },
  { label: "Very Private", value: "very_private", body: "App lock, neutral notifications, hidden previews." },
  { label: "Basic", value: "basic", body: "No app lock. Still local-first." }
];

export default function PrivacySetup() {
  const [privacy, setPrivacy] = useState<PrivacyLevel>("private");

  async function save() {
    const existing = await settingsRepo.get();
    const settings = existing ?? await settingsRepo.createDefault();
    await settingsRepo.save({
      ...settings,
      privacyLevel: privacy,
      appLockEnabled: privacy !== "basic",
      notificationPrivacy: privacy === "basic" ? "full" : "neutral",
      hideNotificationPreviews: privacy !== "basic",
      updatedAt: new Date().toISOString()
    });
    router.push("/onboarding/partner");
  }

  return (
    <Screen>
      <SectionTitle eyebrow="Setup" title="Privacy Level" subtitle="Strong privacy, no deceptive camouflage." />
      <Panel>
        <View style={{ gap: 10 }}>
          {levels.map((level) => (
            <View key={level.value} style={{ gap: 6 }}>
              <Pill label={level.label} selected={privacy === level.value} onPress={() => setPrivacy(level.value)} />
              <Text style={{ color: colors.muted2 }}>{level.body}</Text>
            </View>
          ))}
        </View>
        <PrimaryButton label="Continue" onPress={save} />
      </Panel>
    </Screen>
  );
}
