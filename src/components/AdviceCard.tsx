import { Text, View } from "react-native";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react-native";
import { AdviceCard as AdviceCardModel } from "@/src/domain/models";
import { Panel, PrimaryButton, colors } from "@/src/components/ui";

export function AdviceCard({ card, onAction }: { card: AdviceCardModel; onAction?: () => void }) {
  const Icon = card.priority === "urgent" ? AlertTriangle : card.priority === "high" ? CheckCircle2 : Info;
  const iconColor = card.priority === "urgent" ? colors.danger : card.priority === "high" ? colors.gold : colors.accent;

  return (
    <Panel>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
        <Icon color={iconColor} size={24} />
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={{ color: colors.ink, fontWeight: "800", fontSize: 17 }}>{card.title}</Text>
          <Text style={{ color: colors.muted, lineHeight: 21 }}>{card.body}</Text>
        </View>
      </View>
      {card.actionLabel && onAction ? <PrimaryButton label={card.actionLabel} onPress={onAction} /> : null}
    </Panel>
  );
}
