import { router } from "expo-router";
import { View } from "react-native";
import { useState } from "react";
import { ToneMode } from "@/src/domain/models";
import { settingsRepo } from "@/src/db/repositories/settingsRepo";
import { Screen, SectionTitle, Panel, Pill, PrimaryButton } from "@/src/components/ui";

const options: { label: string; value: ToneMode }[] = [
  { label: "Standard", value: "standard" },
  { label: "Tactical", value: "tactical" },
  { label: "Roast mode", value: "roast" }
];

export default function ToneSetup() {
  const [tone, setTone] = useState<ToneMode>("standard");

  async function save() {
    const existing = await settingsRepo.get();
    const settings = existing ?? await settingsRepo.createDefault();
    await settingsRepo.save({ ...settings, toneMode: tone, updatedAt: new Date().toISOString() });
    router.push("/onboarding/privacy");
  }

  return (
    <Screen>
      <SectionTitle title="How should the app talk to you?" subtitle="Roast mode teases you, never your partner." />
      <Panel>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {options.map((option) => (
            <Pill key={option.value} label={option.label} selected={tone === option.value} onPress={() => setTone(option.value)} />
          ))}
        </View>
        <PrimaryButton label="Continue" onPress={save} />
      </Panel>
    </Screen>
  );
}
