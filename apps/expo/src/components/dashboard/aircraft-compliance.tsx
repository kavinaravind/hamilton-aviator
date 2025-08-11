import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { trpc } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

export function AircraftAndCompliance() {
  const {
    data: aircraftStatus,
    isPending: isAircraftPending,
    isError: isAircraftError,
    error: aircraftError,
  } = useQuery(trpc.dashboard.aircraftStatus.queryOptions());
  const {
    data: dutyCompliance,
    isPending: isDutyPending,
    isError: isDutyError,
    error: dutyError,
  } = useQuery(trpc.dashboard.dutyCompliance.queryOptions());

  return (
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
            {isAircraftPending && <Text>Loading...</Text>}
            {isAircraftError && (
              <Text className="text-xs text-red-500">
                {aircraftError?.message}
              </Text>
            )}
            {aircraftStatus && (
              <>
                <Text className="text-2xl font-bold text-gray-900">
                  {aircraftStatus.total}
                </Text>
                <Text className="text-xs text-gray-500">
                  {aircraftStatus.airworthy} airworthy
                </Text>
                <Text className="text-xs text-gray-500">
                  {aircraftStatus.maintenance} maintenance due / soon
                </Text>
              </>
            )}
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
            {isDutyPending && <Text>Loading...</Text>}
            {isDutyError && (
              <Text className="text-xs text-red-500">{dutyError?.message}</Text>
            )}
            {dutyCompliance && (
              <>
                <Text className="text-2xl font-bold text-gray-900">
                  {dutyCompliance.monthlyHours}
                </Text>
                <Text className="text-xs text-gray-500">
                  {dutyCompliance.remainingDuty} remaining
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
