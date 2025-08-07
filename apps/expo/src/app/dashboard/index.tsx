import type {
  AircraftStatus,
  DutyCompliance,
  FlightStats,
  MaintenanceAlert,
  Period,
  QuickStatCardProps,
  RecentFlight,
  UpcomingItem,
} from "@/lib/dashboard";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Stack } from "expo-router";
import {
  getAlertBackgroundColor,
  getAlertColor,
  getEventTypeBackgroundColor,
  getEventTypeColor,
  getEventTypeIcon,
} from "@/lib/dashboard";
import { Ionicons } from "@expo/vector-icons";

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
const recentFlights: RecentFlight[] = [
  {
    id: "1",
    date: "2025-08-05",
    route: "KLAX - KLAS",
    aircraft: "N123AB",
    duration: "2.3",
    type: "Cross-Country",
  },
  {
    id: "2",
    date: "2025-08-03",
    route: "KPHX - KLAX",
    aircraft: "N456CD",
    duration: "3.1",
    type: "Commercial",
  },
];
const upcomingItems: UpcomingItem[] = [
  {
    id: "1",
    type: "checkride",
    title: "Commercial Pilot Checkride",
    date: "2025-08-15",
    location: "KLAX",
    urgent: true,
  },
  {
    id: "2",
    type: "training",
    title: "Recurrent Training - Simulator",
    date: "2025-08-20",
    location: "Training Center",
    urgent: false,
  },
];

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");

  const periods: Period[] = [
    { id: "week", label: "7 Days" },
    { id: "month", label: "30 Days" },
    { id: "year", label: "1 Year" },
  ];

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
          {subtitle && (
            <Text className="text-xs text-gray-500">{subtitle}</Text>
          )}
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
        <FlatList
          data={periods}
          renderItem={({ item }) => renderPeriodTab(item)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <FlatList
        className="flex-1"
        data={[{ key: "content" }]}
        renderItem={() => (
          <View className="px-4 pt-2">
            <View className="mb-4">
              <Text className="mb-3 text-lg font-bold text-gray-900">
                Flight Statistics
              </Text>
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
            <View className="mb-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900">
                  Recent Flights
                </Text>
                <Link href="/dashboard/logbook" asChild>
                  <TouchableOpacity>
                    <Text className="font-medium text-primary">View All</Text>
                  </TouchableOpacity>
                </Link>
              </View>
              {recentFlights.map((flight) => (
                <Link
                  key={flight.id}
                  href={`/dashboard/logbook/flight/${flight.id}`}
                  asChild
                >
                  <TouchableOpacity className="mb-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                    <View className="flex-row items-center">
                      <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <Ionicons name="airplane" size={16} color="#3B82F6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-gray-900">
                          {flight.route}
                        </Text>
                        <Text className="text-xs text-gray-600">
                          {flight.aircraft} • {flight.type}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {flight.date}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-sm font-bold text-blue-600">
                          {flight.duration}h
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={12}
                          color="#9CA3AF"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
            <View className="mb-6">
              <Text className="mb-3 text-lg font-bold text-gray-900">
                Upcoming Events
              </Text>
              {upcomingItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="mb-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                >
                  <View className="flex-row items-center">
                    <View
                      className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: getEventTypeBackgroundColor(item.type),
                      }}
                    >
                      <Ionicons
                        name={getEventTypeIcon(item.type) as any}
                        size={16}
                        color={getEventTypeColor(item.type)}
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </Text>
                        {item.urgent && (
                          <View className="ml-2 rounded-full bg-orange-100 px-2 py-1">
                            <Text className="text-xs font-medium text-orange-600">
                              Soon
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-gray-600">
                        {item.location}
                      </Text>
                      <Text className="text-xs text-gray-500">{item.date}</Text>
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
          </View>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
