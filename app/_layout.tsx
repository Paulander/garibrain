import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { initializeDatabase } from "@/src/db/database";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    void initializeDatabase();
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0B0F10" },
          headerTintColor: "#F2EFE7",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#0B0F10" }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="support/index" options={{ title: "Support Calendar" }} />
        <Stack.Screen name="support/cycle" options={{ title: "Cycle Support" }} />
        <Stack.Screen name="support/pattern" options={{ title: "Support Pattern" }} />
        <Stack.Screen name="debrief/new" options={{ title: "New Debrief" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
