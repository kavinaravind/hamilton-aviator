import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Mock duty period data - replace with actual data source
const mockDutyPeriods = [
  {
    id: "1",
    startTime: "2024-08-05T06:00:00Z",
    endTime: "2024-08-05T14:30:00Z",
    type: "flight-duty",
    description: "Commercial flight operations",
    duration: "8h 30m",
    status: "completed",
  },
  {
    id: "2",
    startTime: "2024-08-04T08:00:00Z",
    endTime: "2024-08-04T12:00:00Z",
    type: "training",
    description: "Recurrent training - simulator",
    duration: "4h 0m",
    status: "completed",
  },
  {
    id: "3",
    startTime: "2024-08-03T10:00:00Z",
    endTime: "2024-08-03T18:00:00Z",
    type: "standby",
    description: "Airport standby duty",
    duration: "8h 0m",
    status: "completed",
  },
  {
    id: "4",
    startTime: "2024-08-02T14:00:00Z",
    endTime: null,
    type: "flight-duty",
    description: "International route - in progress",
    duration: "6h 15m",
    status: "active",
  },
];

export default function DutyLogPage() {
  const getDutyTypeColor = (type: string) => {
    switch (type) {
      case "flight-duty":
        return "#3B82F6"; // blue
      case "training":
        return "#10B981"; // green
      case "standby":
        return "#F59E0B"; // yellow
      case "maintenance":
        return "#8B5CF6"; // purple
      default:
        return "#6B7280"; // gray
    }
  };

  const getDutyTypeIcon = (type: string) => {
    switch (type) {
      case "flight-duty":
        return "airplane";
      case "training":
        return "school";
      case "standby":
        return "time";
      case "maintenance":
        return "construct";
      default:
        return "briefcase";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const renderDutyPeriod = ({
    item,
  }: {
    item: (typeof mockDutyPeriods)[0];
  }) => (
    <Link href={`/dashboard/duty/${item.id}`} asChild>
      <TouchableOpacity className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="mb-2 flex-row items-center">
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: getDutyTypeColor(item.type) + "20" }}
              >
                <Ionicons
                  name={getDutyTypeIcon(item.type) as any}
                  size={20}
                  color={getDutyTypeColor(item.type)}
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold capitalize text-gray-900">
                  {item.type.replace("-", " ")}
                </Text>
                <Text className="text-sm text-gray-600">
                  {item.description}
                </Text>
              </View>
              {item.status === "active" && (
                <View className="rounded-full bg-green-100 px-2 py-1">
                  <Text className="text-xs font-medium text-green-600">
                    Active
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-medium text-gray-700">
                  {formatDate(item.startTime)}
                </Text>
                <Text className="text-sm text-gray-500">
                  {formatTime(item.startTime)} -{" "}
                  {item.endTime ? formatTime(item.endTime) : "In Progress"}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-primary">
                  {item.duration}
                </Text>
                <Text className="text-xs text-gray-500">Duration</Text>
              </View>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#9CA3AF"
            className="ml-2"
          />
        </View>
      </TouchableOpacity>
    </Link>
  );

  // Calculate total duty time for current month
  const getCurrentMonthTotal = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyDuty = mockDutyPeriods.filter((period) => {
      const dutyDate = new Date(period.startTime);
      return (
        dutyDate.getMonth() === currentMonth &&
        dutyDate.getFullYear() === currentYear &&
        period.status === "completed"
      );
    });

    // Simple calculation - in real app, properly parse duration
    const totalHours = monthlyDuty.length * 6; // Mock calculation
    return `${totalHours}h`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with Summary */}
      <View className="border-b border-gray-200 bg-white px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900">Duty Periods</Text>
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-sm text-gray-600">
            {mockDutyPeriods.length} total periods
          </Text>
          <View className="items-end">
            <Text className="text-lg font-bold text-primary">
              {getCurrentMonthTotal()}
            </Text>
            <Text className="text-xs text-gray-500">This month</Text>
          </View>
        </View>
      </View>

      {/* Duty Periods List */}
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={mockDutyPeriods}
          renderItem={renderDutyPeriod}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Ionicons name="time-outline" size={48} color="#9CA3AF" />
              <Text className="mt-4 text-lg text-gray-500">
                No duty periods logged
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                Start tracking your duty time
              </Text>
            </View>
          }
        />
      </View>

      {/* Add Duty Period Button */}
      <View className="px-4 pb-6">
        <Link href="/dashboard/duty/add" asChild>
          <TouchableOpacity className="items-center rounded-lg bg-primary py-4 shadow-sm">
            <View className="flex-row items-center">
              <Ionicons name="add" size={24} color="white" />
              <Text className="ml-2 text-lg font-semibold text-white">
                Add Duty Period
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
