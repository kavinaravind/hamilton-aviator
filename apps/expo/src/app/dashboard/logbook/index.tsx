import type { Flight } from "@/lib/logbook";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Stack } from "expo-router";
import {
  calculateTotalFlightTime,
  formatDate,
  formatFlightDuration,
} from "@/lib/logbook";
import { Ionicons } from "@expo/vector-icons";

const flights: Flight[] = [
  {
    id: "1",
    date: "2024-08-05",
    route: "KLAX - KLAS",
    aircraft: "C172",
    duration: "2.3",
    tailNumber: "N123AB",
  },
  {
    id: "2",
    date: "2024-08-03",
    route: "KPHX - KLAX",
    aircraft: "PA28",
    duration: "3.1",
    tailNumber: "N456CD",
  },
  {
    id: "3",
    date: "2024-07-30",
    route: "KLAS - KPHX",
    aircraft: "C172",
    duration: "1.8",
    tailNumber: "N789EF",
  },
];

const FlightItem = ({ item }: { item: Flight }) => (
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>(flights);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredFlights(flights);
    } else {
      const filtered = flights.filter(
        (flight: Flight) =>
          flight.route.toLowerCase().includes(query.toLowerCase()) ||
          flight.aircraft.toLowerCase().includes(query.toLowerCase()) ||
          flight.tailNumber.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredFlights(filtered);
    }
  };

  const totalFlightTime = calculateTotalFlightTime(filteredFlights);

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
