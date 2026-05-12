import { router } from "expo-router";
import { Text } from "react-native";
import { settingsRepo } from "@/src/db/repositories/settingsRepo";
import { Screen, SectionTitle, Panel, PrimaryButton, SecondaryButton, colors } from "@/src/components/ui";

export default function SupportOptIn() {
  async function complete() {
    const existing = await settingsRepo.get();
    if (existing) {
      await settingsRepo.save({ ...existing, onboardingComplete: true, updatedAt: new Date().toISOString() });
    }
    router.replace("/today");
  }

  return (
    <Screen>
      <SectionTitle title="Want support reminders?" subtitle="Add recurring windows for patience, practical help, space, affection, or better timing." />
      <Panel>
        <Text style={{ color: colors.muted, lineHeight: 22 }}>
          Cycle-based reminders are estimates for support planning only. They are not medical advice and may be inaccurate.
        </Text>
        <PrimaryButton label="Add support pattern later" onPress={complete} />
        <SecondaryButton label="Finish onboarding" onPress={complete} />
      </Panel>
    </Screen>
  );
}
