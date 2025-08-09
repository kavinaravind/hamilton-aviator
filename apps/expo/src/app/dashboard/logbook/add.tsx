import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import type { DetailedFlight } from "@hamilton/validators/lib/logbook";

export default function AddFlightPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    route: "",
    aircraft: "",
    tailNumber: "",
    departureAirport: "",
    departureTime: "",
    arrivalAirport: "",
    arrivalTime: "",
    totalDuration: "",
    pic: "",
    sic: "",
    solo: "",
    dual: "",
    dayTime: "",
    nightTime: "",
    actualInstrument: "",
    simulatedInstrument: "",
    crossCountry: "",
    dayLandings: "",
    nightLandings: "",
    approaches: "",
    holds: "",
    flightType: "local" as DetailedFlight["flightType"],
    instructor: "",
    remarks: "",
  });

  const handleSave = () => {
    if (
      !formData.date ||
      !formData.departureAirport ||
      !formData.arrivalAirport ||
      !formData.totalDuration
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    Alert.alert("Success", "Flight logged successfully!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const FormField = ({
    label,
    field,
    placeholder,
    required = false,
    keyboardType = "default" as any,
  }: {
    label: string;
    field: string;
    placeholder: string;
    required?: boolean;
    keyboardType?: "default" | "numeric" | "decimal-pad";
  }) => (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-gray-700">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <TextInput
        className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={formData[field as keyof typeof formData]}
        onChangeText={(value) => updateFormData(field, value)}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: "Add Flight",
          headerBackTitle: "Logbook",
          gestureEnabled: true,
        }}
      />
      <ScrollView className="flex-1">
        <View className="bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Flight Details
          </Text>
          <FormField
            label="Date"
            field="date"
            placeholder="YYYY-MM-DD"
            required
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Departure Airport"
                field="departureAirport"
                placeholder="KLAX"
                required
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Departure Time"
                field="departureTime"
                placeholder="14:30"
              />
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Arrival Airport"
                field="arrivalAirport"
                placeholder="KLAS"
                required
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Arrival Time"
                field="arrivalTime"
                placeholder="16:45"
              />
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField label="Aircraft" field="aircraft" placeholder="C172" />
            </View>
            <View className="flex-1">
              <FormField
                label="Tail Number"
                field="tailNumber"
                placeholder="N123AB"
              />
            </View>
          </View>
          <FormField
            label="Total Duration"
            field="totalDuration"
            placeholder="2.3"
            required
            keyboardType="decimal-pad"
          />
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Flight Time
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="PIC"
                field="pic"
                placeholder="2.3"
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="SIC"
                field="sic"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Solo"
                field="solo"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Dual"
                field="dual"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Conditions
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Day"
                field="dayTime"
                placeholder="2.3"
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Night"
                field="nightTime"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Actual Instrument"
                field="actualInstrument"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Simulated Instrument"
                field="simulatedInstrument"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <FormField
            label="Cross Country"
            field="crossCountry"
            placeholder="2.3"
            keyboardType="decimal-pad"
          />
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Landings & Approaches
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Day Landings"
                field="dayLandings"
                placeholder="2"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Night Landings"
                field="nightLandings"
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Approaches"
                field="approaches"
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Holds"
                field="holds"
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Flight Type & Instructor
          </Text>
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Flight Type
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {(
                [
                  "training",
                  "solo",
                  "cross-country",
                  "local",
                  "commercial",
                ] as const
              ).map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`rounded-full px-4 py-2 ${
                    formData.flightType === type ? "bg-blue-600" : "bg-gray-200"
                  }`}
                  onPress={() => updateFormData("flightType", type)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      formData.flightType === type
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace("-", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <FormField
            label="Instructor (if applicable)"
            field="instructor"
            placeholder="John Smith"
          />
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">Remarks</Text>
          <TextInput
            className="h-24 rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
            placeholder="Flight remarks, notes, or comments..."
            placeholderTextColor="#9CA3AF"
            value={formData.remarks}
            onChangeText={(value) => updateFormData("remarks", value)}
            multiline
            textAlignVertical="top"
          />
        </View>
        <View className="mb-8 mt-2 bg-white px-6 py-4">
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 rounded-lg bg-primary py-3 shadow-sm active:bg-primary"
              onPress={handleSave}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="save-outline" size={18} color="white" />
                <Text className="ml-2 text-base font-semibold text-white">
                  Save Flight
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 py-3 active:bg-gray-100"
              onPress={() => router.back()}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="close-outline" size={18} color="#6B7280" />
                <Text className="ml-2 text-base font-medium text-gray-600">
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
