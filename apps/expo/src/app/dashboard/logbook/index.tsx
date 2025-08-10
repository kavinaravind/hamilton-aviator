import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Stack } from "expo-router";
import { trpc } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import type { Logbook } from "@hamilton/validators/lib/logbook";
import {
  calculateTotalFlightTime,
  formatFlightDuration,
} from "@hamilton/validators/lib/logbook";
import { formatDate } from "@hamilton/validators/shared/date";

const FlightItem = ({ item }: { item: Logbook }) => (
  <Link href={`/dashboard/logbook/flight/${item.id}`} asChild>
    <TouchableOpacity className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {item.route}
          </Text>
          <Text className="mt-1 text-sm text-gray-600">
            {item.aircraft} • {item.tailNumber}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            {formatDate(item.date)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-primary">
            {formatFlightDuration(item.duration)}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  </Link>
);

export default function LogbookPage() {
  const {
    data: flights,
    isPending,
    isError,
    error,
  } = useQuery(trpc.logbook.all.queryOptions());

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [filteredFlights, setFilteredFlights] = useState<Logbook[]>([]);

  useEffect(() => {
    if (!flights) {
      setFilteredFlights([]);
      return;
    }
    if (searchQuery === "") {
      setFilteredFlights(flights);
    } else {
      const filtered = flights.filter(
        (flight: Logbook) =>
          flight.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flight.aircraft.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flight.tailNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFlights(filtered);
    }
  }, [flights, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const totalFlightTime = calculateTotalFlightTime(filteredFlights);

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="time-outline" size={64} color="#3B82F6" />
          <Text className="mt-4 text-xl font-bold text-gray-900">
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-xl font-bold text-gray-900">Error</Text>
          <Text className="mt-2 text-center text-gray-600">
            {error instanceof Error
              ? error.message
              : "An error occurred while fetching aircraft."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="bg-white px-4 py-3">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">My Logbook</Text>
          <Text className="text-sm text-gray-500">
            {totalFlightTime}h total
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-2">
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              className="ml-3 flex-1 text-base text-gray-900"
              placeholder="Search flights..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => handleSearch("")}
                className="ml-2 rounded-full bg-gray-200 p-1"
              >
                <Ionicons name="close" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          <Link href="/dashboard/logbook/add" asChild>
            <TouchableOpacity className="items-center justify-center rounded-xl bg-primary px-4 py-2">
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={filteredFlights}
          renderItem={FlightItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Ionicons name="airplane-outline" size={48} color="#9CA3AF" />
              <Text className="mt-4 text-lg text-gray-500">
                No flights found
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Start logging your flights!"}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
