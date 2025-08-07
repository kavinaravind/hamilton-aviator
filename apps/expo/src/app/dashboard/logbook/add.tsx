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

export default function AddFlightPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    departure: "",
    arrival: "",
    aircraft: "",
    tailNumber: "",
    duration: "",
    pic: "",
    sic: "",
    night: "",
    instrument: "",
    crossCountry: "",
    remarks: "",
  });

  const handleSave = () => {
    // Basic validation
    if (
      !formData.date ||
      !formData.departure ||
      !formData.arrival ||
      !formData.duration
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Mock save - in real app, this would save to database
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

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Flight Details Section */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
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
                label="Departure"
                field="departure"
                placeholder="KLAX"
                required
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Arrival"
                field="arrival"
                placeholder="KLAS"
                required
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
            field="duration"
            placeholder="2.3"
            required
            keyboardType="decimal-pad"
          />
        </View>

        {/* Flight Time Section */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
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
                label="Night"
                field="night"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Instrument"
                field="instrument"
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

        {/* Remarks Section */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
            Remarks
          </Text>

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

        {/* Save Button */}
        <TouchableOpacity
          className="mb-6 rounded-lg bg-primary py-4 shadow-sm"
          onPress={handleSave}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="save" size={20} color="white" />
            <Text className="ml-2 text-lg font-semibold text-white">
              Save Flight
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
