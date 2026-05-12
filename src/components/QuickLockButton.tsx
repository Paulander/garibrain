import { Pressable } from "react-native";
import { LockKeyhole } from "lucide-react-native";
import { privacyLock } from "@/src/services/privacyLock";
import { colors } from "@/src/components/ui";

export function QuickLockButton() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Quick lock"
      onPress={() => privacyLock.quickLock()}
      style={{ paddingHorizontal: 16, paddingVertical: 8 }}
    >
      <LockKeyhole color={colors.sage} size={22} />
    </Pressable>
  );
}
