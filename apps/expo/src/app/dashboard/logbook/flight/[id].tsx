import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Mock flight data - in real app, this would come from database
const mockFlightData = {
  "1": {
    id: "1",
    date: "2024-08-05",
    departure: "KLAX",
    arrival: "KLAS",
    route: "KLAX - KLAS",
    aircraft: "C172",
    tailNumber: "N123AB",
    duration: "2.3",
    pic: "2.3",
    sic: "0.0",
    night: "0.0",
    instrument: "0.5",
    crossCountry: "2.3",
    remarks: "VFR flight with light turbulence. Good visibility throughout.",
    departureTime: "08:30",
    arrivalTime: "10:48",
  },
  "2": {
    id: "2",
    date: "2024-08-03",
    departure: "KPHX",
    arrival: "KLAX",
    route: "KPHX - KLAX",
    aircraft: "PA28",
    tailNumber: "N456CD",
    duration: "3.1",
    pic: "3.1",
    sic: "0.0",
    night: "1.2",
    instrument: "2.8",
    crossCountry: "3.1",
    remarks: "IFR flight with IMC conditions. Approach to minimums.",
    departureTime: "18:15",
    arrivalTime: "21:24",
  },
  "3": {
    id: "3",
    date: "2024-07-30",
    departure: "KLAS",
    arrival: "KPHX",
    route: "KLAS - KPHX",
    aircraft: "C172",
    tailNumber: "N789EF",
    duration: "1.8",
    pic: "1.8",
    sic: "0.0",
    night: "0.0",
    instrument: "0.0",
    crossCountry: "1.8",
    remarks: "Local training flight. Pattern work and maneuvers.",
    departureTime: "14:00",
    arrivalTime: "15:48",
  },
};

export default function FlightDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const flight = mockFlightData[id as keyof typeof mockFlightData];

  if (!flight) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Stack.Screen
          options={{
            title: "Flight Not Found",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "600",
              color: "#111827",
            },
            headerTintColor: "#6366f1",
          }}
        />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="airplane-outline" size={64} color="#9CA3AF" />
          <Text className="mt-4 text-xl font-semibold text-gray-900">
            Flight Not Found
          </Text>
          <Text className="mt-2 text-center text-gray-600">
            The flight you're looking for doesn't exist or may have been
            deleted.
          </Text>
          <TouchableOpacity
            className="mt-6 rounded-lg bg-primary px-6 py-3"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleEdit = () => {
    // In real app, navigate to edit screen or enable editing mode
    Alert.alert("Edit Flight", "Edit functionality would be implemented here");
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Flight",
      "Are you sure you want to delete this flight? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Mock delete - in real app, would delete from database
            Alert.alert("Deleted", "Flight has been deleted", [
              { text: "OK", onPress: () => router.back() },
            ]);
          },
        },
      ],
    );
  };

  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between py-2">
      <Text className="text-sm font-medium text-gray-600">{label}</Text>
      <Text className="text-sm text-gray-900">{value}</Text>
    </View>
  );

  const formatTime = (hours: string) => {
    const h = parseFloat(hours);
    if (h === 0) return "0:00";
    const wholeHours = Math.floor(h);
    const minutes = Math.round((h - wholeHours) * 60);
    return `${wholeHours}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: flight.route,
          headerShown: true,
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
            color: "#111827",
          },
          headerTintColor: "#6366f1",
          gestureEnabled: true,
          animation: "slide_from_right",
          headerRight: () => (
            <View className="flex-row gap-2">
              <TouchableOpacity onPress={handleEdit} className="p-2">
                <Ionicons name="pencil" size={20} color="#6366f1" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} className="p-2">
                <Ionicons name="trash" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Flight Overview */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-900">
              {flight.route}
            </Text>
            <Text className="text-2xl font-bold text-primary">
              {flight.duration}h
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="items-center">
              <Text className="text-sm text-gray-500">Departure</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {flight.departureTime}
              </Text>
            </View>

            <View className="flex-1 items-center">
              <Ionicons name="airplane" size={24} color="#6366f1" />
              <Text className="mt-1 text-xs text-gray-500">
                {flight.aircraft} • {flight.tailNumber}
              </Text>
            </View>

            <View className="items-center">
              <Text className="text-sm text-gray-500">Arrival</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {flight.arrivalTime}
              </Text>
            </View>
          </View>

          <View className="mt-4 rounded-lg bg-gray-50 p-3">
            <Text className="text-center text-sm text-gray-600">
              {flight.date}
            </Text>
          </View>
        </View>

        {/* Flight Time Breakdown */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
            Flight Time Breakdown
          </Text>

          <DetailRow label="Total Time" value={`${flight.duration}h`} />
          <DetailRow label="Pilot in Command" value={`${flight.pic}h`} />
          <DetailRow label="Second in Command" value={`${flight.sic}h`} />
          <DetailRow label="Night" value={`${flight.night}h`} />
          <DetailRow label="Instrument" value={`${flight.instrument}h`} />
          <DetailRow label="Cross Country" value={`${flight.crossCountry}h`} />
        </View>

        {/* Aircraft Details */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
            Aircraft Details
          </Text>

          <DetailRow label="Aircraft Type" value={flight.aircraft} />
          <DetailRow label="Tail Number" value={flight.tailNumber} />
          <DetailRow label="Departure Airport" value={flight.departure} />
          <DetailRow label="Arrival Airport" value={flight.arrival} />
        </View>

        {/* Remarks */}
        {flight.remarks && (
          <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Remarks
            </Text>
            <Text className="leading-6 text-gray-700">{flight.remarks}</Text>
          </View>
        )}

        {/* Quick Stats */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
            Quick Stats
          </Text>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {formatTime(flight.duration)}
              </Text>
              <Text className="text-xs text-gray-500">Duration</Text>
            </View>

            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {formatTime(flight.instrument)}
              </Text>
              <Text className="text-xs text-gray-500">Instrument</Text>
            </View>

            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {formatTime(flight.night)}
              </Text>
              <Text className="text-xs text-gray-500">Night</Text>
            </View>

            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">
                {formatTime(flight.crossCountry)}
              </Text>
              <Text className="text-xs text-gray-500">XC</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
