import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Stack } from "expo-router";
import { RecentFlights } from "@/components/dashboard/recent-flights";
import { Ionicons } from "@expo/vector-icons";

import type {
  AircraftStatus,
  DutyCompliance,
  FlightStats,
  MaintenanceAlert,
  Period,
  RecentFlight,
} from "@hamilton/validators/lib/dashboard";
import {
  getAlertBackgroundColor,
  getAlertColor,
} from "@hamilton/validators/lib/dashboard";

const flightStats: FlightStats = {
  totalTime: "1,247.3",
  pic: "892.1",
  monthlyTime: "18.7",
  last30Days: 12,
};
const aircraftStatus: AircraftStatus = {
  total: 4,
  airworthy: 2,
  maintenance: 1,
  maintenanceSoon: 1,
};
const dutyCompliance: DutyCompliance = {
  activeDuty: 1,
  monthlyHours: "87.5",
  remainingDuty: "72.5",
  nextRest: "14:30",
};
const maintenanceAlerts: MaintenanceAlert[] = [
  {
    id: "1",
    aircraftId: "N123AB",
    type: "100-Hour Inspection",
    dueInHours: 7.8,
    urgent: true,
  },
  {
    id: "2",
    aircraftId: "N456CD",
    type: "Annual Inspection",
    dueInDays: 45,
    urgent: false,
  },
];

const periods: Period[] = [
  { id: "week", label: "7 Days" },
  { id: "month", label: "30 Days" },
  { id: "year", label: "1 Year" },
];

type QuickStatCardProps = {
  title: string;
  value: string;
  icon: string;
  color: string;
  subtitle?: string | undefined;
  onPress?: () => void;
};

const QuickStatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  onPress,
}: QuickStatCardProps) => (
  <TouchableOpacity
    className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    onPress={onPress}
    disabled={!onPress}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-sm font-medium text-gray-600">{title}</Text>
        <Text className="text-2xl font-bold text-gray-900">{value}</Text>
        {subtitle && <Text className="text-xs text-gray-500">{subtitle}</Text>}
      </View>
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: color + "20" }}
      >
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
    </View>
  </TouchableOpacity>
);

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week");

  const renderPeriodTab = (period: Period) => (
    <TouchableOpacity
      key={period.id}
      className={`mr-3 rounded-full px-4 py-2 ${
        selectedPeriod === period.id ? "bg-blue-100" : "bg-gray-100"
      }`}
      onPress={() => setSelectedPeriod(period.id)}
    >
      <Text
        className={`text-sm font-medium ${
          selectedPeriod === period.id ? "text-blue-700" : "text-gray-700"
        }`}
      >
        {period.label}
      </Text>
    </TouchableOpacity>
  );

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
            <View className="mb-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900">
                  Flight Statistics
                </Text>
                <FlatList
                  className="ml-3"
                  data={periods}
                  renderItem={({ item }) => renderPeriodTab(item)}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              <View className="mb-3 flex-row gap-3">
                <QuickStatCard
                  title="Total Time"
                  value={flightStats.totalTime}
                  subtitle="hours logged"
                  icon="time"
                  color="#3B82F6"
                />
                <QuickStatCard
                  title="PIC Time"
                  value={flightStats.pic}
                  subtitle="pilot in command"
                  icon="person"
                  color="#10B981"
                />
              </View>
              <View className="flex-row gap-3">
                <QuickStatCard
                  title="Monthly Time"
                  value={flightStats.monthlyTime}
                  subtitle="this month"
                  icon="calendar"
                  color="#F59E0B"
                />
                <QuickStatCard
                  title="Recent Flights"
                  value={flightStats.last30Days.toString()}
                  subtitle="last 30 days"
                  icon="airplane"
                  color="#8B5CF6"
                />
              </View>
            </View>
            <View className="mb-4">
              <Text className="mb-3 text-lg font-bold text-gray-900">
                Aircraft & Compliance
              </Text>
              <View className="mb-3 flex-row gap-3">
                <Link href="/dashboard/aircraft" asChild>
                  <TouchableOpacity className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-sm font-medium text-gray-600">
                        Aircraft Fleet
                      </Text>
                      <Ionicons name="airplane" size={20} color="#3B82F6" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900">
                      {aircraftStatus.total}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {aircraftStatus.airworthy} airworthy,{" "}
                      {aircraftStatus.maintenance} in maintenance
                    </Text>
                  </TouchableOpacity>
                </Link>
                <Link href="/dashboard/compliance/duty-log" asChild>
                  <TouchableOpacity className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-sm font-medium text-gray-600">
                        Duty Hours
                      </Text>
                      <Ionicons name="timer" size={20} color="#EF4444" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900">
                      {dutyCompliance.monthlyHours}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {dutyCompliance.remainingDuty} remaining
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
            <View className="mb-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900">
                  Maintenance Alerts
                </Text>
                <Link href="/dashboard/aircraft" asChild>
                  <TouchableOpacity>
                    <Text className="font-medium text-primary">View All</Text>
                  </TouchableOpacity>
                </Link>
              </View>
              {maintenanceAlerts.map((alert) => (
                <TouchableOpacity
                  key={alert.id}
                  className="mb-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                >
                  <View className="flex-row items-center">
                    <View
                      className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: getAlertBackgroundColor(alert.urgent),
                      }}
                    >
                      <Ionicons
                        name="warning"
                        size={16}
                        color={getAlertColor(alert.urgent)}
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-sm font-semibold text-gray-900">
                          {alert.aircraftId}
                        </Text>
                        {alert.urgent && (
                          <View className="ml-2 rounded-full bg-red-100 px-2 py-1">
                            <Text className="text-xs font-medium text-red-600">
                              Urgent
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-gray-600">
                        {alert.type}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Due in{" "}
                        {alert.dueInHours
                          ? `${alert.dueInHours} hrs`
                          : `${alert.dueInDays} days`}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#9CA3AF"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <RecentFlights />
          </View>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
