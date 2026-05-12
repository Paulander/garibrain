import { Text } from "react-native";
import { Preference } from "@/src/domain/models";
import { BookmarkCheck } from "lucide-react-native";
import { Panel, Pill, RowItem, colors } from "@/src/components/ui";

export function PreferenceCard({ preference }: { preference: Preference }) {
  return (
    <Panel>
      <RowItem
        icon={<BookmarkCheck color={colors.sage} size={22} />}
        title={preference.title}
        meta={`${preference.category} - ${preference.sentiment}`}
        trailing={<Pill label={preference.importance} tone={preference.importance === "critical" ? "blocker" : "info"} />}
      />
      <Text style={{ color: colors.ivory, lineHeight: 21 }}>{preference.value}</Text>
      {preference.isSensitive ? <Pill label="sensitive" tone="blocker" /> : null}
    </Panel>
  );
}
