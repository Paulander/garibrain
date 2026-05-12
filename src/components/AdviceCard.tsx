import { Text, View } from "react-native";
import { AlertTriangle, CheckCircle2, ChevronRight, Info } from "lucide-react-native";
import { AdviceCard as AdviceCardModel } from "@/src/domain/models";
import { Panel, Pill, RowItem, colors } from "@/src/components/ui";

export function AdviceCard({ card, onAction }: { card: AdviceCardModel; onAction?: () => void }) {
  const Icon = card.priority === "urgent" ? AlertTriangle : card.priority === "high" ? CheckCircle2 : Info;
  const iconColor = card.priority === "urgent" ? colors.red : card.priority === "high" ? colors.amber : colors.sage;
  const tone = card.priority === "urgent" ? "blocker" : card.priority === "high" ? "watch" : "info";

  return (
    <Panel tone={card.priority === "urgent" ? "danger" : "default"}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Pill label={card.priority} tone={tone} />
        {card.actionLabel ? <Text style={{ color: colors.muted2, fontSize: 11 }}>{card.actionLabel}</Text> : null}
      </View>
      <RowItem
        icon={<Icon color={iconColor} size={22} />}
        title={card.title}
        meta={card.body}
        trailing={onAction ? <ChevronRight color={colors.muted2} size={18} /> : undefined}
      />
    </Panel>
  );
}
