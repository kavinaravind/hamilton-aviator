import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Stack } from "expo-router";
import { AircraftAndCompliance } from "@/components/dashboard/aircraft-compliance";
import { FlightStatistics } from "@/components/dashboard/flight-statistics";
import { MaintenanceAlerts } from "@/components/dashboard/maintenance-alerts";
import { RecentFlights } from "@/components/dashboard/recent-flights";

export default function DashboardPage() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="bg-white px-4 py-3">
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-900">
              My Dashboard
            </Text>
            <Text className="text-sm text-gray-600">
              Flight operations and compliance
            </Text>
          </View>
          <Link href="/dashboard/compliance/duty-log/add" asChild>
            <TouchableOpacity className="rounded-lg bg-primary px-4 py-2">
              <Text className="font-semibold text-white">Quick Log</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <FlatList
        className="flex-1"
        data={[{ key: "content" }]}
        renderItem={() => (
          <View className="px-4 pt-2">
            <FlightStatistics />
            <AircraftAndCompliance />
            <MaintenanceAlerts />
            <RecentFlights />
          </View>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
