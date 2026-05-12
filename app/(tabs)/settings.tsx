import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { Panel, Pill, PrimaryButton, Screen, SectionTitle, colors } from "@/src/components/ui";
import { NotificationPrivacy, ToneMode } from "@/src/domain/models";
import { settingsRepo } from "@/src/db/repositories/settingsRepo";
import { deleteEverything, exportLocalData } from "@/src/services/exportImport";

export default function SettingsScreen() {
  const [tone, setTone] = useState<ToneMode>("standard");
  const [notificationPrivacy, setNotificationPrivacy] = useState<NotificationPrivacy>("neutral");
  const [exportPreview, setExportPreview] = useState("");

  useFocusEffect(useCallback(() => {
    settingsRepo.get().then((settings) => {
      if (settings) {
        setTone(settings.toneMode);
        setNotificationPrivacy(settings.notificationPrivacy);
      }
    });
  }, []));

  async function saveSettings(nextTone = tone, nextPrivacy = notificationPrivacy) {
    const settings = await settingsRepo.get();
    if (!settings) return;
    await settingsRepo.save({ ...settings, toneMode: nextTone, notificationPrivacy: nextPrivacy, updatedAt: new Date().toISOString() });
  }

  async function deleteData() {
    await deleteEverything();
    router.replace("/onboarding");
  }

  return (
    <Screen>
      <SectionTitle title="Settings" subtitle="Privacy-first defaults and local data controls." />
      <Panel>
        <Text style={{ color: colors.ink, fontWeight: "800", fontSize: 17 }}>Tone</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["standard", "tactical", "roast"] as const).map((option) => (
            <Pill key={option} label={option} selected={tone === option} onPress={() => { setTone(option); void saveSettings(option, notificationPrivacy); }} />
          ))}
        </View>
      </Panel>
      <Panel>
        <Text style={{ color: colors.ink, fontWeight: "800", fontSize: 17 }}>Notification Privacy</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["full", "neutral", "minimal", "silent"] as const).map((option) => (
            <Pill key={option} label={option} selected={notificationPrivacy === option} onPress={() => { setNotificationPrivacy(option); void saveSettings(tone, option); }} />
          ))}
        </View>
      </Panel>
      <Panel>
        <Text style={{ color: colors.ink, fontWeight: "800", fontSize: 17 }}>Data</Text>
        <PrimaryButton label="Export data preview" onPress={async () => setExportPreview(await exportLocalData())} />
        <PrimaryButton label="Delete all local data" onPress={deleteData} />
        {exportPreview ? <Text numberOfLines={10} style={{ color: colors.muted, fontFamily: "Courier", fontSize: 12 }}>{exportPreview}</Text> : null}
      </Panel>
      <Panel>
        <Text style={{ color: colors.ink, fontWeight: "800", fontSize: 17 }}>Legal</Text>
        <Text style={{ color: colors.muted, lineHeight: 21 }}>
          PartnerOps is a private memory and planning tool. It is not therapy, medical advice, or a health diagnosis tool.
        </Text>
      </Panel>
    </Screen>
  );
}
