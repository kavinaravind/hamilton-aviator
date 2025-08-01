import React from "react";
import { Tabs } from "expo-router";

import { colors, StyledTabBarIcon } from "@hamilton/ui";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.blue,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <StyledTabBarIcon
              name={focused ? "home-outline" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="logbook"
        options={{
          title: "Logbook",
          tabBarIcon: ({ color, focused }) => (
            <StyledTabBarIcon
              name={focused ? "book" : "book-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="aircraft"
        options={{
          title: "Aircraft",
          tabBarIcon: ({ color, focused }) => (
            <StyledTabBarIcon
              name={focused ? "airplane" : "airplane-takeoff"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add-flight"
        options={{
          title: "Add Flight",
          tabBarIcon: ({ color, focused }) => (
            <StyledTabBarIcon
              name={focused ? "plus" : "plus-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
