import { Tabs } from "expo-router";
import { Bell, CalendarDays, Flame, ListChecks, Settings } from "lucide-react-native";
import { QuickLockButton } from "@/src/components/QuickLockButton";

const tint = "#355C5C";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#F7F4EE" },
        headerTintColor: "#17201D",
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: "#66736B",
        tabBarStyle: { backgroundColor: "#FBF8F2", borderTopColor: "#DDD5CA" },
        headerRight: () => <QuickLockButton />
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />
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
          tabBarIcon: ({ color, size }) => <ListChecks color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="panic"
        options={{
          title: "Panic",
          tabBarIcon: ({ color, size }) => <Flame color={color} size={size} />
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
