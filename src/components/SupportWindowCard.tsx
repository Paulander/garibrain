import { Text } from "react-native";
import { SupportWindow } from "@/src/domain/cycleEngine";
import { Panel, colors } from "@/src/components/ui";

export function SupportWindowCard({ window }: { window: SupportWindow }) {
  return (
    <Panel>
      <Text style={{ color: colors.ink, fontSize: 17, fontWeight: "800" }}>{window.label}</Text>
      <Text style={{ color: colors.muted }}>
        {window.startDate} through {window.endDate} - confidence {window.confidence}
      </Text>
      <Text style={{ color: colors.ink, lineHeight: 21 }}>
        Saved actions: {window.supportActions.join(", ") || "add support actions"}
      </Text>
    </Panel>
  );
}
