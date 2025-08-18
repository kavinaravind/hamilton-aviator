import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { trpc } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { formatDate } from "@hamilton/validators/shared/date";

export function RecentFlights() {
  const {
    data: recentFlights,
    isPending,
    isError,
    error,
  } = useQuery(trpc.dashboard.recentFlights.queryOptions());

  return (
    <View className="mb-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">Recent Flights</Text>
        <Link href="/dashboard/logbook" asChild>
          <TouchableOpacity>
            <Text className="font-medium text-primary">View All</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {isPending && <Text>Loading recent flights...</Text>}
      {isError && (
        <View>
          <Text>Error loading recent flights.</Text>
          <Text selectable className="text-xs text-red-500">
            {error?.message}
          </Text>
        </View>
      )}
      {!isPending &&
        !isError &&
        recentFlights?.map((flight) => (
          <Link
            key={flight.id}
            href={`/dashboard/logbook/${flight.id}`}
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
                    {formatDate(String(flight.date))}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-bold text-blue-600">
                    {flight.duration}h
                  </Text>
                  <Ionicons name="chevron-forward" size={12} color="#9CA3AF" />
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
    </View>
  );
}
