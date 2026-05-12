import { PropsWithChildren, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { LockKeyhole } from "lucide-react-native";
import { privacyLock } from "@/src/services/privacyLock";
import { PrimaryButton, colors } from "@/src/components/ui";

export function PrivacyGate({ children }: PropsWithChildren) {
  const [unlocked, setUnlocked] = useState(!privacyLock.isLocked());

  useEffect(() => {
    const unsubscribe = privacyLock.subscribe((locked) => setUnlocked(!locked));
    return unsubscribe;
  }, []);

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 24, backgroundColor: colors.ink }}>
      <LockKeyhole color={colors.sage} size={42} />
      <Text style={{ color: colors.ivory, fontSize: 22, fontWeight: "800", textAlign: "center" }}>PartnerOps is locked</Text>
      <Text style={{ color: colors.muted2, textAlign: "center", lineHeight: 21 }}>
        Unlock to view private notes and sensitive sections.
      </Text>
      <PrimaryButton
        label="Unlock"
        onPress={async () => {
          const ok = await privacyLock.unlock();
          setUnlocked(ok);
        }}
      />
    </View>
  );
}
