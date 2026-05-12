import { Text } from "react-native";
import { Preference } from "@/src/domain/models";
import { Panel, colors } from "@/src/components/ui";

export function PreferenceCard({ preference }: { preference: Preference }) {
  return (
    <Panel>
      <Text style={{ color: colors.ink, fontSize: 17, fontWeight: "800" }}>{preference.title}</Text>
      <Text style={{ color: colors.muted }}>{preference.category} - {preference.sentiment} - {preference.importance}</Text>
      <Text style={{ color: colors.ink, lineHeight: 21 }}>{preference.value}</Text>
      {preference.isSensitive ? <Text style={{ color: colors.danger, fontWeight: "700" }}>Sensitive</Text> : null}
    </Panel>
  );
}
