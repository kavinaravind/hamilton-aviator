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
import { Ionicons } from "@expo/vector-icons";

// Mock flight data - replace with actual data source
const mockFlights = [
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

export default function LogBookPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFlights, setFilteredFlights] = useState(mockFlights);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredFlights(mockFlights);
    } else {
      const filtered = mockFlights.filter(
        (flight) =>
          flight.route.toLowerCase().includes(query.toLowerCase()) ||
          flight.aircraft.toLowerCase().includes(query.toLowerCase()) ||
          flight.tailNumber.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredFlights(filtered);
    }
  };

  const renderFlightItem = ({ item }: { item: (typeof mockFlights)[0] }) => (
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
            <Text className="mt-1 text-sm text-gray-500">{item.date}</Text>
          </View>
          <View className="items-end">
            <Text className="text-lg font-bold text-primary">
              {item.duration}h
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Search and Filter Bar */}
      <View className="border-b border-gray-200 bg-white px-4 py-3">
        <View className="flex-row items-center rounded-lg bg-gray-100 px-3 py-2">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="ml-2 flex-1 text-gray-900"
            placeholder="Search flights (route, aircraft, tail number...)"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Flight List */}
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={filteredFlights}
          renderItem={renderFlightItem}
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

      {/* Floating Action Button */}
      <Link href="/dashboard/logbook/add" asChild>
        <TouchableOpacity className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg">
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}
