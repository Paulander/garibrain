import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useEffect, useState } from "react";
import { settingsRepo } from "@/src/db/repositories/settingsRepo";

export default function Index() {
  const [target, setTarget] = useState<"/onboarding" | "/today" | null>(null);

  useEffect(() => {
    let mounted = true;
    settingsRepo.get().then((settings) => {
      if (mounted) {
        setTarget(settings ? "/today" : "/onboarding");
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (target) {
    return <Redirect href={target} />;
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F4EE" }}>
      <ActivityIndicator color="#355C5C" />
    </View>
  );
}
