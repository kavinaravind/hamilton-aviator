import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { trpc } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import type { ReportType } from "@hamilton/validators/lib/compliance";

const categories = [
  { id: "all", label: "All Reports" },
  { id: "regulatory", label: "Regulatory" },
  { id: "export", label: "Export" },
  { id: "custom", label: "Custom" },
];

export default function ReportPage() {
  const {
    data: reports,
    isPending,
    isError,
    error,
  } = useQuery(trpc.report.all.queryOptions());

  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [filteredReports, setFilteredReports] = useState<ReportType[]>([]);

  useEffect(() => {
    if (!reports) {
      setFilteredReports([]);
      return;
    }
    let filtered = reports;
    if (searchQuery !== "") {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (report) => report.category === selectedCategory,
      );
    }
    setFilteredReports(filtered);
  }, [reports, searchQuery, selectedCategory]);

  const handleGenerateReport = async (reportId: string, title: string) => {
    setIsGenerating(reportId);
    setTimeout(() => {
      setIsGenerating(null);
      Alert.alert(
        "Report Generated",
        `TODO: ${title} has been generated successfully and saved to your device.`,
        [{ text: "OK" }],
      );
    }, 2000);
  };

  const renderReportType = ({ item }: { item: ReportType }) => (
    <TouchableOpacity
      className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      onPress={() => handleGenerateReport(item.id, item.title)}
      disabled={isGenerating === item.id}
    >
      <View className="flex-row items-start">
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: item.color + "20" }}
        >
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        <View className="flex-1">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">
              {item.title}
            </Text>
            {isGenerating === item.id ? (
              <View className="rounded-full bg-blue-100 px-2 py-1">
                <Text className="text-xs font-medium text-blue-600">
                  Generating...
                </Text>
              </View>
            ) : (
              <Ionicons name="download-outline" size={16} color="#9CA3AF" />
            )}
          </View>

          <Text className="mb-2 text-sm text-gray-600">{item.description}</Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-500">
              Est. {item.estimatedTime}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              <Text className="ml-1 text-xs text-green-600">
                {item.requiredData.length} data sources
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryTab = (category: { id: string; label: string }) => (
    <TouchableOpacity
      key={category.id}
      className={`mr-3 rounded-full px-4 py-2 ${
        selectedCategory === category.id ? "bg-blue-100" : "bg-gray-100"
      }`}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text
        className={`text-sm font-medium ${
          selectedCategory === category.id ? "text-blue-700" : "text-gray-700"
        }`}
      >
        {category.label}
      </Text>
    </TouchableOpacity>
  );

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
      <View className="bg-white px-4 py-3">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">My Reports</Text>
          <Text className="text-sm text-gray-500">
            {filteredReports.length} reports {searchQuery && "found"}
          </Text>
        </View>
        <View className="flex-row items-center rounded-xl border border-gray-100 bg-gray-100 px-4 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="ml-3 flex-1 text-base text-gray-900"
            placeholder="Search reports..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <View className="bg-white px-4 pb-2">
        <FlatList
          data={categories}
          renderItem={({ item }) => renderCategoryTab(item)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <FlatList
        className="flex-1"
        data={[{ key: "content" }]}
        renderItem={() => (
          <View className="px-4 pt-2">
            <View className="mb-4">
              <Text className="mb-3 text-lg font-bold text-gray-900">
                Available Reports ({filteredReports.length})
              </Text>
              <FlatList
                data={filteredReports}
                renderItem={renderReportType}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ListEmptyComponent={() => (
                  <View className="items-center py-8">
                    <Ionicons
                      name="document-outline"
                      size={48}
                      color="#9CA3AF"
                    />
                    <Text className="mt-2 text-gray-500">No reports found</Text>
                    <Text className="text-sm text-gray-400">
                      Try adjusting your search or category filter
                    </Text>
                  </View>
                )}
              />
            </View>
            <View className="mb-6 rounded-lg bg-blue-50 p-4">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <View className="ml-3 flex-1">
                  <Text className="mb-1 text-sm font-semibold text-blue-900">
                    Report Generation Tips
                  </Text>
                  <Text className="text-sm text-blue-700">
                    Ensure your logbook entries are up to date before generating
                    reports
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
