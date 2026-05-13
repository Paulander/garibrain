import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { Bell, ChevronRight, Cloud, HelpCircle, Moon, ShieldCheck, UserRound } from "lucide-react-native";
import { BrandMark, Panel, Pill, PrimaryButton, RowItem, Screen, SectionTitle, colors } from "@/src/components/ui";
import { NotificationPrivacy, ToneMode } from "@/src/domain/models";
import { settingsRepo } from "@/src/db/repositories/settingsRepo";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { deleteEverything, exportLocalData } from "@/src/services/exportImport";

export default function SettingsScreen() {
  const [tone, setTone] = useState<ToneMode>("standard");
  const [notificationPrivacy, setNotificationPrivacy] = useState<NotificationPrivacy>("neutral");
  const [exportPreview, setExportPreview] = useState("");
  const [profileLabel, setProfileLabel] = useState("Partner profile");
  const [profileMeta, setProfileMeta] = useState("No partner profile loaded");

  useFocusEffect(useCallback(() => {
    async function load() {
      const [settings, partners] = await Promise.all([settingsRepo.get(), partnerRepo.list()]);
      if (settings) {
        setTone(settings.toneMode);
        setNotificationPrivacy(settings.notificationPrivacy);
      }
      const [partner] = partners;
      if (partner) {
        setProfileLabel(partner.displayName);
        setProfileMeta(`${partner.relationshipType} - local-only profile`);
      }
    }
    void load();
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
      <SectionTitle
        eyebrow="Settings"
        title="Settings"
        subtitle="Privacy-first defaults and local data controls."
        right={<BrandMark size={44} />}
      />
      <Panel tone="elevated">
        <RowItem
          icon={<UserRound color={colors.ivory} size={22} />}
          title={profileLabel}
          meta={profileMeta}
          trailing={<ChevronRight color={colors.muted2} size={18} />}
        />
      </Panel>
      <Panel>
        <RowItem icon={<Moon color={colors.sage} size={22} />} title="Tone" meta="Controls how direct the app gets." />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["standard", "tactical", "roast"] as const).map((option) => (
            <Pill key={option} label={option} selected={tone === option} onPress={() => { setTone(option); void saveSettings(option, notificationPrivacy); }} />
          ))}
        </View>
      </Panel>
      <Panel>
        <RowItem icon={<Bell color={colors.sage} size={22} />} title="Notification Privacy" meta="Neutral by default. No sensitive previews needed." />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["full", "neutral", "minimal", "silent"] as const).map((option) => (
            <Pill key={option} label={option} selected={notificationPrivacy === option} onPress={() => { setNotificationPrivacy(option); void saveSettings(tone, option); }} />
          ))}
        </View>
      </Panel>
      <Panel>
        <RowItem icon={<Cloud color={colors.sage} size={22} />} title="Data & Backup" meta="Local-first controls for export and deletion." />
        <PrimaryButton label="Export data preview" onPress={async () => setExportPreview(await exportLocalData())} />
        <PrimaryButton label="Delete all local data" tone="danger" onPress={deleteData} />
        {exportPreview ? <Text numberOfLines={10} style={{ color: colors.muted2, fontFamily: "Courier", fontSize: 12 }}>{exportPreview}</Text> : null}
      </Panel>
      <Panel>
        <RowItem icon={<ShieldCheck color={colors.sage} size={22} />} title="Privacy Boundary" meta="No fake calculator, no hidden launcher, no surveillance." />
        <Text style={{ color: colors.muted2, lineHeight: 21 }}>
          PartnerOps is a private memory and planning tool. It is not therapy, medical advice, or a health diagnosis tool.
        </Text>
        <RowItem icon={<HelpCircle color={colors.sage} size={22} />} title="Help & Resources" meta="Manual task: add public support and privacy policy URLs before store submission." />
      </Panel>
    </Screen>
  );
}
