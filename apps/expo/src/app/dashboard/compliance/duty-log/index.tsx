import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Stack } from "expo-router";
import { trpc } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import type { DutyLog } from "@hamilton/validators/lib/compliance";
import {
  calculateMonthlyDutyTime,
  getDutyTypeColor,
  getDutyTypeIcon,
  getDutyTypeText,
} from "@hamilton/validators/lib/compliance";
import { formatDate, formatTime } from "@hamilton/validators/shared/date";

const renderDutyLogEntry = ({ item }: { item: DutyLog }) => (
  <Link href={`/dashboard/compliance/duty-log/${item.id}`} asChild>
    <TouchableOpacity className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="mb-2 flex-row items-center">
            <View
              className="mr-3 h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: getDutyTypeColor(item.type) + "20" }}
            >
              <Ionicons
                name={getDutyTypeIcon(item.type) as any}
                size={20}
                color={getDutyTypeColor(item.type)}
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {getDutyTypeText(item.type)}
              </Text>
              <Text className="text-sm text-gray-600">{item.description}</Text>
            </View>
            {item.status === "active" && (
              <View className="rounded-full bg-green-100 px-2 py-1">
                <Text className="text-xs font-medium text-green-600">
                  Active
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-gray-700">
                {formatDate(item.startTime)}
              </Text>
              <Text className="text-sm text-gray-500">
                {formatTime(item.startTime)} -{" "}
                {item.endTime ? formatTime(item.endTime) : "In Progress"}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-lg font-bold text-primary">
                {item.duration}
              </Text>
              <Text className="text-xs text-gray-500">Duration</Text>
            </View>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={16}
          color="#9CA3AF"
          className="ml-2"
        />
      </View>
    </TouchableOpacity>
  </Link>
);

export default function DutyLogPage() {
  const {
    data: dutyEntries,
    isPending,
    isError,
    error,
  } = useQuery(trpc.dutyLog.all.queryOptions());

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredDutyEntries, setFilteredDutyEntries] = useState<DutyLog[]>([]);

  useEffect(() => {
    if (!dutyEntries) {
      setFilteredDutyEntries([]);
      return;
    }
    if (searchQuery === "") {
      setFilteredDutyEntries(dutyEntries);
    } else {
      const filtered = dutyEntries.filter(
        (entry: DutyLog) =>
          entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.type.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredDutyEntries(filtered);
    }
  }, [dutyEntries, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Stack.Screen options={{ headerShown: false }} />
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
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-xl font-bold text-gray-900">Error</Text>
          <Text className="mt-2 text-center text-gray-600">
            {error instanceof Error
              ? error.message
              : "An error occurred while fetching aircraft."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="bg-white px-4 py-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">
              My Duty Log
            </Text>
            <Text className="text-sm text-gray-600">
              {dutyEntries.length} logged duties
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-lg font-bold text-primary">
              {calculateMonthlyDutyTime(dutyEntries)}
            </Text>
            <Text className="text-xs text-gray-500">This month</Text>
          </View>
        </View>
      </View>
      <View className="border-b border-gray-200 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center rounded-lg bg-gray-100 px-3 py-3">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="ml-2 flex-1 text-gray-900"
              placeholder="Search entries..."
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
          <Link href="/dashboard/compliance/duty-log/add" asChild>
            <TouchableOpacity className="items-center justify-center rounded-lg bg-primary px-4 py-2">
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={filteredDutyEntries}
          renderItem={renderDutyLogEntry}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Ionicons name="time-outline" size={48} color="#9CA3AF" />
              <Text className="mt-4 text-lg text-gray-500">
                {searchQuery
                  ? "No duty entries found"
                  : "No duty entries logged"}
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Start tracking your duty time"}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
