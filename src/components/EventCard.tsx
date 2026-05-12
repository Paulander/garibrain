import { Text } from "react-native";
import { RelationshipEvent } from "@/src/domain/models";
import { daysUntil } from "@/src/utils/dates";
import { Panel, colors } from "@/src/components/ui";

export function EventCard({ event, todayIso }: { event: RelationshipEvent; todayIso: string }) {
  const distance = daysUntil(event.date, todayIso);
  const label = distance === 0 ? "today" : distance > 0 ? `in ${distance} days` : `${Math.abs(distance)} days ago`;

  return (
    <Panel>
      <Text style={{ color: colors.ink, fontSize: 17, fontWeight: "800" }}>{event.title}</Text>
      <Text style={{ color: colors.muted }}>{event.eventType.replaceAll("_", " ")} - {label}</Text>
      <Text style={{ color: colors.muted }}>Lead reminders: {event.leadTimeDays.join(", ") || "same day"}</Text>
    </Panel>
  );
}
