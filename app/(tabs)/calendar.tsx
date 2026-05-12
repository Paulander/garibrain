import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { EventCard } from "@/src/components/EventCard";
import { Field, Panel, Pill, PrimaryButton, Screen, SectionTitle } from "@/src/components/ui";
import { RelationshipEvent } from "@/src/domain/models";
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

  return (
    <Screen>
      <SectionTitle title="Calendar" subtitle="Important dates, support windows, gift deadlines, and follow-ups." />
      <Panel>
        <Field label="Title" value={title} onChangeText={setTitle} />
        <Field label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(["none", "yearly", "monthly", "weekly"] as const).map((option) => (
            <Pill key={option} label={option} selected={recurrence === option} onPress={() => setRecurrence(option)} />
          ))}
        </View>
        <PrimaryButton label="Add important date" onPress={saveEvent} />
      </Panel>
      {events.map((event) => <EventCard key={event.id} event={event} todayIso={todayISO()} />)}
    </Screen>
  );
}
