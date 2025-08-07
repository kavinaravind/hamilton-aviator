import type { DutyEntry } from "@/lib/duty";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  formatDate,
  formatTime,
  getDutyStatusColor,
  getDutyStatusText,
  getDutyTypeColor,
  getDutyTypeIcon,
  getDutyTypeText,
} from "@/lib/duty";
import { Ionicons } from "@expo/vector-icons";

const DutyEntries: DutyEntry[] = [
  {
    id: "1",
    startTime: "2025-08-05T06:00:00Z",
    endTime: null,
    type: "flight-duty",
    description: "Commercial flight operations",
    duration: "-",
    status: "active",
  },
  {
    id: "2",
    startTime: "2025-08-04T08:00:00Z",
    endTime: "2025-08-04T12:00:00Z",
    type: "training",
    description: "Recurrent training - simulator",
    duration: "4h 0m",
    status: "completed",
  },
  {
    id: "3",
    startTime: "2025-08-03T10:00:00Z",
    endTime: "2025-08-03T18:00:00Z",
    type: "standby",
    description: "Airport standby duty",
    duration: "8h 0m",
    status: "completed",
  },
  {
    id: "4",
    startTime: "2025-08-02T14:00:00Z",
    endTime: "2025-08-02T20:15:00Z",
    type: "flight-duty",
    description: "International route",
    duration: "6h 15m",
    status: "completed",
  },
];

export default function DutyDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const dutyEntry = DutyEntries.find((entry) => entry.id === id);

  if (!dutyEntry) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Stack.Screen options={{ title: "Duty Not Found" }} />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-xl font-bold text-gray-900">
            Duty Entry Not Found
          </Text>
          <Text className="mt-2 text-center text-gray-600">
            The duty entry you're looking for doesn't exist or has been removed.
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

  const handleEdit = () => {
    Alert.alert("Edit Duty", "TODO");
  };

  const handleComplete = () => {
    if (dutyEntry.status === "active") {
      Alert.alert(
        "Complete Duty",
        "Are you sure you want to complete this duty entry?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Complete",
            style: "default",
            onPress: () => {
              Alert.alert("Completed", "Duty entry has been completed");
            },
          },
        ],
      );
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Duty Entry",
      "Are you sure you want to delete this duty entry? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Deleted", "Duty entry has been deleted", [
              { text: "OK", onPress: () => router.back() },
            ]);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: getDutyTypeText(dutyEntry.type),
          headerBackTitle: "Duty Log",
          gestureEnabled: true,
          headerRight: () => (
            <TouchableOpacity onPress={handleEdit} className="mr-2">
              <Ionicons name="create-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1">
        <View className="bg-white px-6 py-4">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                {getDutyTypeText(dutyEntry.type)}
              </Text>
              <Text className="mt-1 text-sm text-gray-600">
                {dutyEntry.description}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-blue-600">
                {dutyEntry.duration}
              </Text>
              <View
                className="mt-2 rounded-full px-3 py-1"
                style={{
                  backgroundColor: `${getDutyStatusColor(dutyEntry.status)}20`,
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: getDutyStatusColor(dutyEntry.status) }}
                >
                  {getDutyStatusText(dutyEntry.status)}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="items-center">
              <Text className="text-sm text-gray-500">Start Time</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {formatTime(dutyEntry.startTime)}
              </Text>
              <Text className="text-sm text-gray-600">
                {formatDate(dutyEntry.startTime)}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: getDutyTypeColor(dutyEntry.type) }}
              >
                <Ionicons
                  name={getDutyTypeIcon(dutyEntry.type) as any}
                  size={24}
                  color="white"
                />
              </View>
            </View>
            <View className="items-center">
              <Text className="text-sm text-gray-500">End Time</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {dutyEntry.endTime
                  ? formatTime(dutyEntry.endTime)
                  : "In Progress"}
              </Text>
              {dutyEntry.endTime && (
                <Text className="text-sm text-gray-600">
                  {formatDate(dutyEntry.endTime)}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            Duty Details
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">Type</Text>
              <Text className="text-base text-gray-900">
                {getDutyTypeText(dutyEntry.type)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">Status</Text>
              <Text className="text-base text-gray-900">
                {getDutyStatusText(dutyEntry.status)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Duration
              </Text>
              <Text className="text-base text-gray-900">
                {dutyEntry.duration}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">
                Start Date
              </Text>
              <Text className="text-base text-gray-900">
                {formatDate(dutyEntry.startTime)}
              </Text>
            </View>
            {dutyEntry.endTime && (
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-gray-600">
                  End Date
                </Text>
                <Text className="text-base text-gray-900">
                  {formatDate(dutyEntry.endTime)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">Actions</Text>
          <View>
            {dutyEntry.status === "active" && (
              <TouchableOpacity
                className="mb-3 flex-row items-center rounded-lg bg-green-50 px-4 py-3"
                onPress={handleComplete}
              >
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="ml-3 text-base font-medium text-green-700">
                  Complete Duty
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="mb-3 flex-row items-center rounded-lg bg-blue-50 px-4 py-3"
              onPress={handleEdit}
            >
              <Ionicons name="create" size={20} color="#3B82F6" />
              <Text className="ml-3 text-base font-medium text-blue-700">
                Edit Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center rounded-lg bg-red-50 px-4 py-3"
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={20} color="#EF4444" />
              <Text className="ml-3 text-base font-medium text-red-700">
                Delete Entry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
