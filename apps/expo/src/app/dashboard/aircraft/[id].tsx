import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { trpc } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import {
  getStatusColor,
  getStatusText,
} from "@hamilton/validators/lib/aircraft";
import { formatDate } from "@hamilton/validators/shared/date";

export default function AircraftDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    data: aircraft,
    isPending,
    isError,
    error,
  } = useQuery(trpc.aircraft.byID.queryOptions({ id }));

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Stack.Screen options={{ title: "Loading..." }} />
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
        <Stack.Screen options={{ title: "Error" }} />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-xl font-bold text-gray-900">Error</Text>
          <Text className="mt-2 text-center text-gray-600">
            {error instanceof Error
              ? error.message
              : "An error occurred while fetching the aircraft."}
          </Text>
          <TouchableOpacity
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!aircraft) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Stack.Screen options={{ title: "Aircraft Not Found" }} />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-xl font-bold text-gray-900">
            Aircraft Not Found
          </Text>
          <Text className="mt-2 text-center text-gray-600">
            The aircraft you're looking for doesn't exist or has been removed.
          </Text>
          <TouchableOpacity
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: aircraft.tailNumber,
          headerBackTitle: "Aircraft",
          gestureEnabled: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => Alert.alert("Edit", "Edit aircraft details")}
              className="mr-2"
            >
              <Ionicons name="create-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1">
        <View className="bg-white px-6 pt-6">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-gray-900">
                {aircraft.tailNumber}
              </Text>
              <Text className="mt-1 text-lg text-gray-600">
                {aircraft.year} {aircraft.make} {aircraft.model}
              </Text>
            </View>
            <View className="items-end">
              <View className="mb-2 flex-row items-center">
                <View
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(aircraft.status) }}
                />
                <Text
                  className="text-sm font-semibold"
                  style={{ color: getStatusColor(aircraft.status) }}
                >
                  {getStatusText(aircraft.status)}
                </Text>
              </View>
              <View
                className={`rounded-full px-3 py-1 ${
                  aircraft.ownership === "owned"
                    ? "bg-blue-100"
                    : "bg-orange-100"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    aircraft.ownership === "owned"
                      ? "text-blue-700"
                      : "text-orange-700"
                  }`}
                >
                  {aircraft.ownership === "owned" ? "Owned" : "Rental"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Flight Time
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {aircraft.totalTime}
              </Text>
              <Text className="text-sm text-gray-500">Total Hours</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {aircraft.engine.totalTime}
              </Text>
              <Text className="text-sm text-gray-500">Engine Hours</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {aircraft.propeller.totalTime}
              </Text>
              <Text className="text-sm text-gray-500">Propeller Hours</Text>
            </View>
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Engine & Propeller
          </Text>
          <View className="space-y-3">
            <View>
              <Text className="text-sm font-medium text-gray-600">Engine</Text>
              <Text className="text-base text-gray-900">
                {aircraft.engine.make} {aircraft.engine.model}
              </Text>
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-600">
                Propeller
              </Text>
              <Text className="text-base text-gray-900">
                {aircraft.propeller.make} {aircraft.propeller.model}
              </Text>
            </View>
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Maintenance
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Annual Due
              </Text>
              <Text className="text-base text-gray-900">
                {formatDate(aircraft.annualDue)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Last Maintenance
              </Text>
              <Text className="text-base text-gray-900">
                {formatDate(aircraft.lastMaintenance)}
              </Text>
            </View>
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Insurance
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">Company</Text>
              <Text className="text-base text-gray-900">
                {aircraft.insurance.company}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Policy Number
              </Text>
              <Text className="text-base text-gray-900">
                {aircraft.insurance.policyNumber}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">Expires</Text>
              <Text className="text-base text-gray-900">
                {formatDate(aircraft.insurance.expires)}
              </Text>
            </View>
          </View>
        </View>
        <View className="mb-6 mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Registration
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Category
              </Text>
              <Text className="text-base text-gray-900">
                {aircraft.registration.category}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">Class</Text>
              <Text className="text-base text-gray-900">
                {aircraft.registration.class}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">Expires</Text>
              <Text className="text-base text-gray-900">
                {formatDate(aircraft.registration.expires)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
