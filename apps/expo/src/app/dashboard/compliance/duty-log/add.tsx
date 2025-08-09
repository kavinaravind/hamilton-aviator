import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import type { DutyEntry } from "@hamilton/validators/lib/compliance";
import {
  getDutyTypeColor,
  getDutyTypeIcon,
  getDutyTypeText,
} from "@hamilton/validators/lib/compliance";

export default function AddDutyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "flight-duty" as DutyEntry["type"],
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    notes: "",
  });

  const dutyTypes: DutyEntry["type"][] = [
    "flight-duty",
    "standby",
    "training",
    "maintenance",
  ];

  const handleSave = () => {
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }
    if (!formData.startDate || !formData.startTime) {
      Alert.alert("Error", "Please enter start date and time");
      return;
    }

    Alert.alert("Success", "Duty entry has been created", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const renderDutyTypeOption = (type: DutyEntry["type"]) => {
    const isSelected = formData.type === type;
    return (
      <TouchableOpacity
        key={type}
        className={`mb-3 flex-row items-center rounded-lg border px-4 py-3 ${
          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
        }`}
        onPress={() => setFormData({ ...formData, type })}
      >
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: isSelected
              ? getDutyTypeColor(type)
              : getDutyTypeColor(type) + "20",
          }}
        >
          <Ionicons
            name={getDutyTypeIcon(type) as any}
            size={20}
            color={isSelected ? "white" : getDutyTypeColor(type)}
          />
        </View>
        <View className="flex-1">
          <Text
            className={`text-base font-medium ${
              isSelected ? "text-blue-900" : "text-gray-900"
            }`}
          >
            {getDutyTypeText(type)}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: "Add Duty Entry",
          headerBackTitle: "Duty Log",
          gestureEnabled: true,
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} className="mr-2">
              <Text className="text-base font-semibold text-blue-600">
                Save
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Duty Type
            </Text>
            {dutyTypes.map(renderDutyTypeOption)}
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Basic Information
            </Text>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Description *
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                placeholder="Enter duty description"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={2}
              />
            </View>
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Time Information
            </Text>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Start Date *
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                placeholder="YYYY-MM-DD"
                value={formData.startDate}
                onChangeText={(text) =>
                  setFormData({ ...formData, startDate: text })
                }
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Start Time *
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                placeholder="HH:MM"
                value={formData.startTime}
                onChangeText={(text) =>
                  setFormData({ ...formData, startTime: text })
                }
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                End Date
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                placeholder="YYYY-MM-DD (leave empty if ongoing)"
                value={formData.endDate}
                onChangeText={(text) =>
                  setFormData({ ...formData, endDate: text })
                }
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                End Time
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                placeholder="HH:MM (leave empty if ongoing)"
                value={formData.endTime}
                onChangeText={(text) =>
                  setFormData({ ...formData, endTime: text })
                }
              />
            </View>
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Additional Information
            </Text>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Notes
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                placeholder="Additional notes or comments"
                value={formData.notes}
                onChangeText={(text) =>
                  setFormData({ ...formData, notes: text })
                }
                multiline
                numberOfLines={3}
              />
            </View>
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
                    Save Duty
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
