import { Tabs } from "expo-router";
import { AlertTriangle, CalendarDays, Home, Settings, Search } from "lucide-react-native";
import { QuickLockButton } from "@/src/components/QuickLockButton";
import { colors } from "@/src/components/ui";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.ink },
        headerTintColor: colors.ivory,
        tabBarActiveTintColor: colors.sage,
        tabBarInactiveTintColor: colors.muted2,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarStyle: {
          minHeight: 70,
          borderTopColor: colors.line,
          backgroundColor: "rgba(15, 19, 18, 0.98)",
          paddingTop: 7
        },
        headerRight: () => <QuickLockButton />
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="memory"
        options={{
          title: "Memory",
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="panic"
        options={{
          title: "Panic",
          tabBarIcon: ({ color, size }) => <AlertTriangle color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
