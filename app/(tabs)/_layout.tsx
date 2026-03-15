import { Tabs } from "expo-router";
import React from "react";

import ActiveHistoryIcon from "@/assets/icons/footer/active-clock-line.svg";
import ActiveHouseIcon from "@/assets/icons/footer/active-house-line.svg";
import ActiveMenuIcon from "@/assets/icons/footer/active-menu.svg";
import ActiveStatisticIcon from "@/assets/icons/footer/active-statistic-line.svg";
import HistoryIcon from "@/assets/icons/footer/clock-line.svg";
import HouseIcon from "@/assets/icons/footer/house-line.svg";
import MenuIcon from "@/assets/icons/footer/menu.svg";
import StatisticIcon from "@/assets/icons/footer/statistic-line.svg";
import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  const TabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <ActiveHouseIcon width={24} height={24} />
    ) : (
      <HouseIcon width={24} height={24} />
    );

  const TabStatisticIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <ActiveStatisticIcon width={24} height={24} />
    ) : (
      <StatisticIcon width={24} height={24} />
    );

  const TabMenuIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <ActiveMenuIcon width={24} height={24} />
    ) : (
      <MenuIcon width={24} height={24} />
    );

  const TabHistoryIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <ActiveHistoryIcon width={24} height={24} />
    ) : (
      <HistoryIcon width={24} height={24} />
    );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0069FE",
        tabBarInactiveTintColor: "#717784",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingBottom: 12, // ✅ altdan boşluq
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana səhifə",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistika",
          tabBarIcon: ({ focused }) => <TabStatisticIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Tarixçə",
          tabBarIcon: ({ focused }) => <TabHistoryIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menyu",
          tabBarIcon: ({ focused }) => <TabMenuIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}
