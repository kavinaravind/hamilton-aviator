import type { Aircraft } from "@/lib/aircraft";
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
import { getStatusColor, getStatusText } from "@/lib/aircraft";
import { Ionicons } from "@expo/vector-icons";

const Aircrafts: Aircraft[] = [
  {
    id: "1",
    tailNumber: "N123AB",
    make: "Cessna",
    model: "172",
    status: "airworthy",
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
    id: "412",
    tailNumber: "N321GH",
    make: "Piper",
    model: "PA-34",
    status: "airworthy",
    ownership: "rented",
  },
];

const AircraftItem = ({ item }: { item: Aircraft }) => (
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

export default function AircraftPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredAircraft: Aircraft[] = Aircrafts.filter(
    (aircraft: Aircraft) => {
      const query = searchQuery.toLowerCase();
      return (
        aircraft.tailNumber.toLowerCase().includes(query) ||
        aircraft.make.toLowerCase().includes(query) ||
        aircraft.model.toLowerCase().includes(query) ||
        getStatusText(aircraft.status).toLowerCase().includes(query) ||
        aircraft.ownership.toLowerCase().includes(query)
      );
    },
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="bg-white px-4 py-3">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">My Aircrafts</Text>
          <Text className="text-sm text-gray-500">
            {filteredAircraft.length} aircraft {searchQuery && "found"}
          </Text>
        </View>
        <View className="flex-row items-center rounded-xl border border-gray-100 bg-gray-100 px-4 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="ml-3 flex-1 text-base text-gray-900"
            placeholder="Search aircrafts..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="ml-2 rounded-full bg-gray-200 p-1"
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={filteredAircraft}
          renderItem={AircraftItem}
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
                {searchQuery && "No aircraft found"}
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                {searchQuery && `No aircraft match for "${searchQuery}"`}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
