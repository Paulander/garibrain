import { Text } from "react-native";
import { SupportWindow } from "@/src/domain/cycleEngine";
import { ShieldCheck } from "lucide-react-native";
import { Panel, Pill, RowItem, colors } from "@/src/components/ui";

export function SupportWindowCard({ window }: { window: SupportWindow }) {
  return (
    <Panel>
      <RowItem
        icon={<ShieldCheck color={colors.sage} size={22} />}
        title={window.label}
        meta={`${window.startDate} through ${window.endDate}`}
        trailing={<Pill label={window.confidence} tone={window.confidence === "low" ? "watch" : "success"} />}
      />
      <Text style={{ color: colors.ivory, lineHeight: 21 }}>
        Saved actions: {window.supportActions.join(", ") || "add support actions"}
      </Text>
    </Panel>
  );
}
