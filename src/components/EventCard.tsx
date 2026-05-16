import { Text } from "react-native";
import { RelationshipEvent } from "@/src/domain/models";
import { daysUntil } from "@/src/utils/dates";
import { nextEventOccurrence } from "@/src/domain/recurrence";
import { CalendarDays } from "lucide-react-native";
import { Panel, Pill, RowItem, colors } from "@/src/components/ui";

export function EventCard({ event, todayIso }: { event: RelationshipEvent; todayIso: string }) {
  const occurrence = nextEventOccurrence(event, todayIso);
  const distance = daysUntil(occurrence, todayIso);
  const label = distance === 0 ? "today" : distance > 0 ? `in ${distance} days` : `${Math.abs(distance)} days ago`;

  return (
    <Panel>
      <RowItem
        icon={<CalendarDays color={colors.sage} size={22} />}
        title={event.title}
        meta={`${event.eventType.replaceAll("_", " ")} - ${label}`}
        trailing={<Pill label={event.recurrence} tone="info" />}
      />
      <Text style={{ color: colors.muted2, fontSize: 12 }}>Lead reminders: {event.leadTimeDays.join(", ") || "same day"}</Text>
    </Panel>
  );
}
