import { router } from "expo-router";
import { BrandMark, Screen, SectionTitle, Panel, PrimaryButton, SecondaryButton, colors } from "@/src/components/ui";
import { Text } from "react-native";

export default function Welcome() {
  return (
    <Screen>
      <SectionTitle
        eyebrow="Private Ops Log"
        title="PartnerOps"
        subtitle="A private relationship memory app for men who mean well but forget details."
        right={<BrandMark size={52} />}
      />
      <Panel>
        <Text style={{ color: colors.ivory, fontSize: 20, fontWeight: "800" }}>Avoid the landmines. Remember what matters.</Text>
        <Text style={{ color: colors.muted2, lineHeight: 22 }}>
          Store dates, preferences, support windows, gift ideas, and lessons without accounts or a backend.
        </Text>
        <PrimaryButton label="Get started" onPress={() => router.push("/onboarding/tone")} />
        <SecondaryButton label="Restore data" onPress={() => router.push("/onboarding/tone")} />
      </Panel>
      <Text style={{ color: colors.muted2, lineHeight: 21 }}>
        PartnerOps is a private memory and planning tool. It is not therapy, medical advice, or a health diagnosis tool.
      </Text>
    </Screen>
  );
}
