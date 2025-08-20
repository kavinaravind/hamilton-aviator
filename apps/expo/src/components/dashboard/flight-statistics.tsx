import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import type { Period } from "@hamilton/validators/lib/dashboard";

const periods: Period[] = [
  { id: "week", label: "7 Days" },
  { id: "month", label: "30 Days" },
  { id: "year", label: "1 Year" },
];
type PeriodId = "week" | "month" | "year";

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

export function FlightStatistics() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodId>("week");

  const {
    data: flightStats,
    isPending: isFlightStatsPending,
    isError: isFlightStatsError,
    error: flightStatsError,
  } = useQuery(
    trpc.dashboard.flightStatistics.queryOptions({ period: selectedPeriod }),
  );

  const renderPeriodTab = (period: Period) => (
    <TouchableOpacity
      key={period.id}
      className={`mr-3 rounded-full px-4 py-2 ${
        selectedPeriod === period.id ? "bg-blue-100" : "bg-gray-100"
      }`}
      onPress={() => setSelectedPeriod(period.id as PeriodId)}
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
      {isFlightStatsPending && (
        <View className="mb-3 gap-3">
          <Skeleton className="mb-2 h-6 w-32" />
          <View className="flex-row gap-3">
            <Skeleton className="h-20 flex-1" />
            <Skeleton className="h-20 flex-1" />
          </View>
          <View className="flex-row gap-3">
            <Skeleton className="h-20 flex-1" />
            <Skeleton className="h-20 flex-1" />
          </View>
        </View>
      )}
      {isFlightStatsError && (
        <Text className="mb-2 text-xs text-red-500">
          {flightStatsError?.message ?? "Failed to load flight statistics."}
        </Text>
      )}
      {!isFlightStatsPending && !isFlightStatsError && (
        <>
          <View className="mb-3 flex-row gap-3">
            <QuickStatCard
              title="Total Time"
              value={flightStats?.totalTime ?? "-"}
              subtitle="hours logged"
              icon="time"
              color="#3B82F6"
            />
            <QuickStatCard
              title="PIC Time"
              value={flightStats?.pic ?? "-"}
              subtitle="pilot in command"
              icon="person"
              color="#10B981"
            />
          </View>
          <View className="flex-row gap-3">
            <QuickStatCard
              title="Period Time"
              value={flightStats?.periodTime ?? "-"}
              subtitle="this period"
              icon="calendar"
              color="#F59E0B"
            />
            <QuickStatCard
              title="Flights"
              value={flightStats ? String(flightStats.periodFlights) : "-"}
              subtitle="this period"
              icon="airplane"
              color="#8B5CF6"
            />
          </View>
        </>
      )}
    </View>
  );
}
