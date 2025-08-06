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

// Mock aircraft data - replace with actual data source
const mockAircraft = [
  {
    id: "1",
    tailNumber: "N123AB",
    make: "Cessna",
    model: "172",
    status: "airworthy", // airworthy, maintenance-soon, maintenance-due
    ownership: "owned",
  },
  {
    id: "2",
    tailNumber: "N456CD",
    make: "Piper",
    model: "PA-28",
    status: "maintenance-soon",
    ownership: "rented",
  },
  {
    id: "3",
    tailNumber: "N789EF",
    make: "Cessna",
    model: "172",
    status: "maintenance-due",
    ownership: "owned",
  },
  {
    id: "4",
    tailNumber: "N321GH",
    make: "Piper",
    model: "PA-34",
    status: "airworthy",
    ownership: "rented",
  },
];

export default function AircraftListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "airworthy":
        return "#10B981"; // green
      case "maintenance-soon":
        return "#F59E0B"; // yellow
      case "maintenance-due":
        return "#EF4444"; // red
      default:
        return "#6B7280"; // gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "airworthy":
        return "Airworthy";
      case "maintenance-soon":
        return "Maintenance Soon";
      case "maintenance-due":
        return "Maintenance Due";
      default:
        return "Unknown";
    }
  };

  // Filter aircraft based on search query
  const filteredAircraft = mockAircraft.filter((aircraft) => {
    const query = searchQuery.toLowerCase();
    return (
      aircraft.tailNumber.toLowerCase().includes(query) ||
      aircraft.make.toLowerCase().includes(query) ||
      aircraft.model.toLowerCase().includes(query) ||
      getStatusText(aircraft.status).toLowerCase().includes(query) ||
      aircraft.ownership.toLowerCase().includes(query)
    );
  });

  const renderAircraftItem = ({ item }: { item: (typeof mockAircraft)[0] }) => (
    <Link href={`/dashboard/aircraft/${item.id}`} asChild>
      <TouchableOpacity className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="mb-1 flex-row items-center">
              <Text className="text-lg font-bold text-gray-900">
                {item.tailNumber}
              </Text>
              <View className="ml-2 rounded-full bg-gray-100 px-2 py-1">
                <Text className="text-xs font-medium text-gray-600">
                  {item.ownership === "owned" ? "Owned" : "Rental"}
                </Text>
              </View>
            </View>
            <Text className="text-md mb-2 text-gray-700">
              {item.make} {item.model}
            </Text>
            <View className="flex-row items-center">
              <View
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: getStatusColor(item.status) }}
              />
              <Text
                className="text-sm font-medium"
                style={{ color: getStatusColor(item.status) }}
              >
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="bg-white px-4 py-4">
        <Text className="text-lg font-bold text-gray-900">My Aircraft</Text>
      </View>
      <View className="border-b border-gray-200 bg-white px-4 pb-3">
        <View className="flex-row items-center rounded-lg bg-gray-100 px-3 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="ml-2 flex-1 text-base text-gray-900"
            placeholder="Search aircraft..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="ml-2"
            >
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={filteredAircraft}
          renderItem={renderAircraftItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Ionicons
                name={searchQuery ? "search" : "airplane-outline"}
                size={48}
                color="#9CA3AF"
              />
              <Text className="mt-4 text-lg text-gray-500">
                {searchQuery ? "No aircraft found" : "No aircraft found"}
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                {searchQuery
                  ? `No aircraft match "${searchQuery}"`
                  : "Add your first aircraft to get started"}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
