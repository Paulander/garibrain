import { router } from "expo-router";
import { Text } from "react-native";
import { CheckCircle2, Lightbulb } from "lucide-react-native";
import { settingsRepo } from "@/src/db/repositories/settingsRepo";
import { Screen, SectionTitle, Panel, PrimaryButton, SecondaryButton, RowItem, colors } from "@/src/components/ui";
import { tipsForTags } from "@/src/domain/promptCoach";

export default function SupportOptIn() {
  const [tip] = tipsForTags(["cycle", "support"], 1);

  async function complete() {
    const existing = await settingsRepo.get();
    if (existing) {
      await settingsRepo.save({ ...existing, onboardingComplete: true, updatedAt: new Date().toISOString() });
    }
    router.replace("/today");
  }

  return (
    <Screen>
      <SectionTitle eyebrow="Setup" title="Support Reminders" subtitle="Add recurring windows for patience, practical help, space, affection, or better timing." />
      <Panel>
        <Text style={{ color: colors.muted2, lineHeight: 22 }}>
          Cycle-based reminders are estimates for support planning only. They are not medical advice and may be inaccurate.
        </Text>
        {tip ? (
          <>
            <RowItem icon={<Lightbulb color={colors.amber} size={22} />} title={tip.title} meta={tip.body} />
            <RowItem icon={<CheckCircle2 color={colors.sage} size={18} />} title="Capture what helps, not a theory about why it happens." />
          </>
        ) : null}
        <PrimaryButton label="Add support pattern later" onPress={complete} />
        <SecondaryButton label="Finish onboarding" onPress={complete} />
      </Panel>
    </Screen>
  );
}
