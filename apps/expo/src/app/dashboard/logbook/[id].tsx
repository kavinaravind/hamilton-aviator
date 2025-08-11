import {
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
  formatFlightDuration,
  getFlightTypeColor,
  getFlightTypeText,
} from "@hamilton/validators/lib/logbook";
import { formatDate } from "@hamilton/validators/shared/date";

export default function FlightDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    data: flight,
    isPending,
    isError,
    error,
  } = useQuery(trpc.logbook.byID.queryOptions({ id }));

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

  if (!flight) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Stack.Screen options={{ title: "Flight Not Found" }} />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-xl font-bold text-gray-900">
            Flight Not Found
          </Text>
          <Text className="mt-2 text-center text-gray-600">
            The flight you're looking for doesn't exist or may have been
            deleted.
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
          title: flight.route,
          headerBackTitle: "Logbook",
          gestureEnabled: true,
          headerRight: () => (
            <TouchableOpacity className="mr-2">
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
                {flight.route}
              </Text>
              <Text className="mt-1 text-lg text-gray-600">
                {flight.aircraft} • {flight.tailNumber}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-blue-600">
                {formatFlightDuration(flight.duration)}
              </Text>
              <View
                className="mt-2 rounded-full px-3 py-1"
                style={{
                  backgroundColor: `${getFlightTypeColor(flight.flightType)}20`,
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: getFlightTypeColor(flight.flightType) }}
                >
                  {getFlightTypeText(flight.flightType)}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="items-center">
              <Text className="text-sm text-gray-500">Departure</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {flight.departure.time}
              </Text>
              <Text className="text-sm text-gray-600">
                {flight.departure.airport}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Ionicons name="airplane" size={24} color="#6366f1" />
              <Text className="mt-1 text-xs text-gray-500">
                {formatDate(flight.date)}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-gray-500">Arrival</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {flight.arrival.time}
              </Text>
              <Text className="text-sm text-gray-600">
                {flight.arrival.airport}
              </Text>
            </View>
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Flight Time
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {formatFlightDuration(flight.flightTime.pic)}
              </Text>
              <Text className="text-sm text-gray-500">PIC</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {formatFlightDuration(flight.flightTime.dual)}
              </Text>
              <Text className="text-sm text-gray-500">Dual</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {formatFlightDuration(flight.flightTime.solo)}
              </Text>
              <Text className="text-sm text-gray-500">Solo</Text>
            </View>
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Conditions
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">Day</Text>
              <Text className="text-base text-gray-900">
                {formatFlightDuration(flight.conditions.day)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">Night</Text>
              <Text className="text-base text-gray-900">
                {formatFlightDuration(flight.conditions.night)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Actual Instrument
              </Text>
              <Text className="text-base text-gray-900">
                {formatFlightDuration(flight.conditions.actualInstrument)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Cross Country
              </Text>
              <Text className="text-base text-gray-900">
                {formatFlightDuration(flight.conditions.crossCountry)}
              </Text>
            </View>
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Landings & Approaches
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Day Landings
              </Text>
              <Text className="text-base text-gray-900">
                {flight.landings.day}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Night Landings
              </Text>
              <Text className="text-base text-gray-900">
                {flight.landings.night}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Approaches
              </Text>
              <Text className="text-base text-gray-900">
                {flight.approaches}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">Holds</Text>
              <Text className="text-base text-gray-900">{flight.holds}</Text>
            </View>
          </View>
        </View>
        {flight.instructor && (
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Instructor
            </Text>
            <Text className="text-base text-gray-900">{flight.instructor}</Text>
          </View>
        )}
        {flight.remarks && (
          <View className="mb-6 mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Remarks
            </Text>
            <Text className="leading-6 text-gray-700">{flight.remarks}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
