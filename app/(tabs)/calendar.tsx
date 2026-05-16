import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { CalendarHeart, CalendarPlus, ListChecks } from "lucide-react-native";
import { EventCard } from "@/src/components/EventCard";
import { BrandMark, Field, Metric, Panel, Pill, PrimaryButton, RowItem, Screen, SectionTitle, colors } from "@/src/components/ui";
import { RelationshipEvent } from "@/src/domain/models";
import { HolidayPreset, buildHolidayEvent, missingDefaultHolidayPresets, missingHolidayPresets } from "@/src/domain/holidayPresets";
import { eventRepo } from "@/src/db/repositories/eventRepo";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { id, nowUtcISO, todayISO } from "@/src/utils/dates";

export default function CalendarScreen() {
  const [events, setEvents] = useState<RelationshipEvent[]>([]);
  const [title, setTitle] = useState("Important date");
  const [date, setDate] = useState(todayISO());
  const [recurrence, setRecurrence] = useState<RelationshipEvent["recurrence"]>("yearly");

  const load = useCallback(async () => {
    setEvents(await eventRepo.list());
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  async function saveEvent() {
    const [partner] = await partnerRepo.list();
    if (!partner) return;
    const now = nowUtcISO();
    await eventRepo.save({
      id: id("event"),
      partnerId: partner.id,
      title,
      eventType: "custom",
      date,
      recurrence,
      leadTimeDays: [30, 14, 7, 1],
      linkedPreferenceIds: [],
      isSensitive: false,
      createdAt: now,
      updatedAt: now
    });
    await load();
  }

  async function addSuggestedDates() {
    const [partner] = await partnerRepo.list();
    if (!partner) return;
    const today = todayISO();
    const existingEvents = await eventRepo.list(partner.id);
    for (const preset of missingDefaultHolidayPresets(existingEvents)) {
      await eventRepo.save(buildHolidayEvent(preset, partner.id, today));
    }
    await load();
  }

  async function addPreset(preset: HolidayPreset) {
    const [partner] = await partnerRepo.list();
    if (!partner) return;
    await eventRepo.save(buildHolidayEvent(preset, partner.id, todayISO()));
    await load();
  }

  const suggestedDates = missingHolidayPresets(events);
  const defaultSuggestedDates = missingDefaultHolidayPresets(events);

  return (
    <Screen>
      <SectionTitle
        eyebrow="Calendar"
        title="Calendar"
        subtitle="Important dates, support windows, gift deadlines, and follow-ups."
        right={<BrandMark size={42} />}
      />
      <Panel tone="elevated">
        <Text style={{ color: colors.ivory, fontWeight: "800", fontSize: 16 }}>Schedule Snapshot</Text>
        <View style={{ flexDirection: "row" }}>
          <Metric value={events.length} label="Saved Dates" tone="sage" />
          <Metric value={events.filter((event) => event.recurrence !== "none").length} label="Recurring" tone="info" />
          <Metric value={events.reduce((count, event) => count + event.leadTimeDays.length, 0)} label="Lead Alerts" tone="amber" />
        </View>
      </Panel>
      <Panel>
        <RowItem
          icon={<CalendarHeart color={colors.amber} size={22} />}
          title="Add the obvious dates."
          meta="Valentine's, Christmas, New Year's, and Mother’s Day presets give the app useful reminders without a long setup session."
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {suggestedDates.slice(0, 6).map((preset) => (
            <Pill key={preset.key} label={preset.title} onPress={() => addPreset(preset)} tone={preset.eventType === "mothers_day" ? "watch" : "info"} />
          ))}
        </View>
        <PrimaryButton label={defaultSuggestedDates.length ? "Add standard date pack" : "Standard dates added"} disabled={!defaultSuggestedDates.length} onPress={addSuggestedDates} />
      </Panel>
      <Panel>
        <RowItem
          icon={<CalendarPlus color={colors.sage} size={22} />}
          title="Add Important Date"
          meta="Add birthdays, anniversaries, first-met dates, or anything personal the presets will never know."
        />
        <Field label="Title" value={title} onChangeText={setTitle} />
        <Field label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["none", "yearly", "monthly", "weekly"] as const).map((option) => (
            <Pill key={option} label={option} selected={recurrence === option} onPress={() => setRecurrence(option)} />
          ))}
        </View>
        <PrimaryButton label="Add important date" onPress={saveEvent} />
      </Panel>
      <Panel>
        <RowItem icon={<ListChecks color={colors.sage} size={22} />} title="Agenda" meta="Upcoming date records saved locally." />
      </Panel>
      {events.map((event) => <EventCard key={event.id} event={event} todayIso={todayISO()} />)}
    </Screen>
  );
}
