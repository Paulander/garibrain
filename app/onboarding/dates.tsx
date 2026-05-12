import { router } from "expo-router";
import { Text } from "react-native";
import { eventRepo } from "@/src/db/repositories/eventRepo";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { id, nowUtcISO, todayISO } from "@/src/utils/dates";
import { Panel, PrimaryButton, Screen, SectionTitle, SecondaryButton, colors } from "@/src/components/ui";

export default function DatesSetup() {
  async function addFromProfile() {
    const [partner] = await partnerRepo.list();
    if (!partner) return router.push("/onboarding/preferences");
    const now = nowUtcISO();
    const events = [
      partner.birthday ? { title: `${partner.displayName}'s birthday`, eventType: "birthday" as const, date: partner.birthday } : null,
      partner.anniversary ? { title: "Anniversary", eventType: "anniversary" as const, date: partner.anniversary } : null,
      partner.firstMetDate ? { title: "First met", eventType: "first_met" as const, date: partner.firstMetDate } : null
    ].filter(Boolean);
    for (const event of events) {
      await eventRepo.save({
        id: id("event"),
        partnerId: partner.id,
        title: event!.title,
        eventType: event!.eventType,
        date: event!.date,
        recurrence: "yearly",
        leadTimeDays: [30, 14, 7, 1],
        linkedPreferenceIds: [],
        isSensitive: false,
        createdAt: now,
        updatedAt: now
      });
    }
    if (!events.length) {
      await eventRepo.save({
        id: id("event"),
        partnerId: partner.id,
        title: "Add a real important date",
        eventType: "custom",
        date: todayISO(),
        recurrence: "none",
        leadTimeDays: [7, 1],
        linkedPreferenceIds: [],
        isSensitive: false,
        notes: "Replace this with a birthday, anniversary, or manually configured holiday.",
        createdAt: now,
        updatedAt: now
      });
    }
    router.push("/onboarding/preferences");
  }

  return (
    <Screen>
      <SectionTitle eyebrow="Setup" title="Important Dates" subtitle="Mother's Day varies by country, so keep it manual for now." />
      <Panel>
        <Text style={{ color: colors.muted2, lineHeight: 22 }}>
          PartnerOps can turn saved birthdays, anniversaries, and custom dates into lead reminders and Today cards.
        </Text>
        <PrimaryButton label="Use profile dates" onPress={addFromProfile} />
        <SecondaryButton label="Skip for now" onPress={() => router.push("/onboarding/preferences")} />
      </Panel>
    </Screen>
  );
}
