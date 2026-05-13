import { PropsWithChildren, ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { BookOpenCheck } from "lucide-react-native";

export function Screen({ children }: PropsWithChildren) {
  return (
    <View style={styles.appFrame}>
      <Texture />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
        contentContainerStyle={styles.screen}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function Panel({
  children,
  style,
  tone = "default"
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; tone?: "default" | "danger" | "elevated" }>) {
  return <View style={[styles.panel, tone === "danger" ? styles.panelDanger : undefined, tone === "elevated" ? styles.panelElevated : undefined, style]}>{children}</View>;
}

export function SectionTitle({
  title,
  subtitle,
  eyebrow,
  right
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.sectionTitleShell}>
      <View style={styles.sectionTitle}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.titleRight}>{right}</View> : null}
    </View>
  );
}

export function Pill({
  label,
  selected,
  onPress,
  tone = "default"
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: "default" | "info" | "watch" | "blocker" | "success";
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        tone === "info" ? styles.pillInfo : undefined,
        tone === "watch" ? styles.pillWatch : undefined,
        tone === "blocker" ? styles.pillBlocker : undefined,
        tone === "success" ? styles.pillSuccess : undefined,
        selected ? styles.pillSelected : undefined
      ]}
    >
      <Text style={[styles.pillText, selected ? styles.pillTextSelected : undefined]}>{label}</Text>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = "default"
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.primaryButton, tone === "danger" ? styles.primaryDanger : undefined, disabled ? styles.disabled : undefined]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.secondaryButton}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function Field(props: TextInputProps & { label: string }) {
  const { label, style, ...rest } = props;
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="#8A8178"
        style={[styles.field, style]}
        {...rest}
      />
    </View>
  );
}

export function BrandMark({ size = 48 }: { size?: number }) {
  const iconSize = Math.max(18, Math.round(size * 0.52));
  return (
    <View style={[styles.brandMark, { width: size, height: size, borderRadius: size * 0.32 }]}>
      <BookOpenCheck color={colors.ink} size={iconSize} strokeWidth={2.6} />
    </View>
  );
}

export function Metric({
  value,
  label,
  tone = "default"
}: {
  value: string | number;
  label: string;
  tone?: "default" | "amber" | "red" | "sage" | "info";
}) {
  const valueColor = tone === "amber" ? colors.amber : tone === "red" ? colors.red : tone === "sage" ? colors.sage : tone === "info" ? colors.info : colors.ivory;
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color: valueColor }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function RowItem({
  title,
  meta,
  trailing,
  icon
}: {
  title: string;
  meta?: string;
  trailing?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <View style={styles.rowItem}>
      {icon ? <View style={styles.rowIcon}>{icon}</View> : null}
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {meta ? <Text style={styles.rowMeta}>{meta}</Text> : null}
      </View>
      {trailing ? <View>{trailing}</View> : null}
    </View>
  );
}

function Texture() {
  return (
    <Svg pointerEvents="none" style={styles.texture} viewBox="0 0 390 844" preserveAspectRatio="none">
      <Path d="M-30 96 C54 45 99 139 171 77 C236 22 280 96 424 40" stroke={colors.texture} strokeWidth="1" fill="none" opacity="0.6" />
      <Path d="M-42 156 C62 89 94 185 176 126 C260 66 297 139 430 94" stroke={colors.texture} strokeWidth="1" fill="none" opacity="0.55" />
      <Path d="M-28 640 C58 594 108 688 184 625 C247 572 292 637 422 590" stroke={colors.texture} strokeWidth="1" fill="none" opacity="0.5" />
      <Path d="M-12 708 C74 655 117 750 205 687 C273 638 323 698 421 657" stroke={colors.texture} strokeWidth="1" fill="none" opacity="0.45" />
      <Circle cx="344" cy="132" r="118" stroke={colors.texture} strokeWidth="1" fill="none" opacity="0.14" />
      <Circle cx="344" cy="132" r="78" stroke={colors.texture} strokeWidth="1" fill="none" opacity="0.14" />
    </Svg>
  );
}

export const colors = {
  ink: "#0B0F10",
  charcoal: "#15181E",
  surface: "#1E2528",
  panel: "#121819",
  panelSoft: "#182021",
  ivory: "#F2EFE7",
  sage: "#7BA07A",
  sageDeep: "#557653",
  amber: "#F2B24A",
  red: "#E15C5C",
  muted: "#6B747A",
  muted2: "#9A968D",
  line: "#2B3434",
  lineStrong: "#766A5A",
  info: "#8FB4C9",
  texture: "#41513F",
  transparent: "transparent",
  background: "#0B0F10",
  accent: "#7BA07A",
  gold: "#F2B24A",
  danger: "#E15C5C",
  border: "#2B3434"
};

export const fonts = {
  regular: "Inter_400Regular",
  semi: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extra: "Inter_800ExtraBold"
};

const styles = StyleSheet.create({
  appFrame: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: colors.ink
  },
  texture: {
    ...StyleSheet.absoluteFillObject
  },
  scroll: {
    flex: 1
  },
  screen: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 34
  },
  panel: {
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(18, 24, 25, 0.92)",
    padding: 16
  },
  panelDanger: {
    borderColor: colors.red,
    backgroundColor: "rgba(74, 26, 22, 0.84)"
  },
  panelElevated: {
    borderColor: colors.lineStrong,
    backgroundColor: "rgba(20, 25, 24, 0.96)"
  },
  sectionTitleShell: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16
  },
  sectionTitle: {
    flex: 1,
    gap: 4
  },
  eyebrow: {
    color: colors.sage,
    fontFamily: fonts.extra,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ivory,
    fontFamily: fonts.extra,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0
  },
  subtitle: {
    color: colors.muted2,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18
  },
  titleRight: {
    alignItems: "flex-end"
  },
  pill: {
    minHeight: 28,
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.panel
  },
  pillSelected: {
    borderColor: colors.sage,
    backgroundColor: "rgba(123, 160, 122, 0.18)"
  },
  pillInfo: {
    borderColor: "rgba(143, 180, 201, 0.55)",
    backgroundColor: "rgba(143, 180, 201, 0.08)"
  },
  pillWatch: {
    borderColor: "rgba(242, 178, 74, 0.65)",
    backgroundColor: "rgba(242, 178, 74, 0.1)"
  },
  pillBlocker: {
    borderColor: "rgba(225, 92, 92, 0.68)",
    backgroundColor: "rgba(225, 92, 92, 0.1)"
  },
  pillSuccess: {
    borderColor: "rgba(123, 160, 122, 0.68)",
    backgroundColor: "rgba(123, 160, 122, 0.12)"
  },
  pillText: {
    color: colors.ivory,
    fontFamily: fonts.extra,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  pillTextSelected: {
    color: colors.sage
  },
  primaryButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.sage
  },
  primaryDanger: {
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: "rgba(225, 92, 92, 0.12)"
  },
  disabled: {
    opacity: 0.45
  },
  primaryButtonText: {
    color: colors.ivory,
    fontFamily: fonts.extra,
    fontSize: 13,
    fontWeight: "800"
  },
  secondaryButton: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    paddingHorizontal: 16
  },
  secondaryButtonText: {
    color: colors.ivory,
    fontFamily: fonts.bold,
    fontSize: 13,
    fontWeight: "700"
  },
  fieldWrap: {
    gap: 6
  },
  fieldLabel: {
    color: colors.muted2,
    fontFamily: fonts.extra,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase"
  },
  field: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(11, 15, 16, 0.72)",
    color: colors.ivory,
    fontFamily: fonts.regular,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14
  },
  brandMark: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.sage,
    borderWidth: 1,
    borderColor: "rgba(242, 239, 231, 0.2)"
  },
  metric: {
    flex: 1,
    minWidth: 74,
    gap: 4,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: colors.line,
    paddingHorizontal: 8
  },
  metricValue: {
    fontFamily: fonts.extra,
    fontSize: 24,
    fontWeight: "800"
  },
  metricLabel: {
    color: colors.muted2,
    fontFamily: fonts.bold,
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center"
  },
  rowItem: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingVertical: 10
  },
  rowIcon: {
    width: 32,
    alignItems: "center"
  },
  rowTitle: {
    color: colors.ivory,
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "700"
  },
  rowMeta: {
    color: colors.muted2,
    fontFamily: fonts.regular,
    fontSize: 12
  }
});
