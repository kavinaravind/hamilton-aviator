import type { ReportType } from "@/lib/compliance/reports";
import { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";

const reportTypes: ReportType[] = [
  {
    id: "faa-8710",
    title: "FAA Form 8710-1 Summary",
    description:
      "Aeronautical experience summary for checkrides and certificates",
    icon: "document-text",
    color: "#3B82F6",
    estimatedTime: "2-3 minutes",
    requiredData: [
      "Total flight time",
      "Cross-country time",
      "Night time",
      "Instrument time",
    ],
    category: "regulatory",
  },
  {
    id: "logbook-export",
    title: "Full Logbook Export",
    description: "Complete digital logbook in PDF format",
    icon: "book",
    color: "#10B981",
    estimatedTime: "1-2 minutes",
    requiredData: [
      "All flight entries",
      "Aircraft information",
      "Pilot endorsements",
    ],
    category: "export",
  },
  {
    id: "duty-log-export",
    title: "Duty Time Report",
    description: "Compliance report for duty time tracking",
    icon: "time",
    color: "#EF4444",
    estimatedTime: "1-2 minutes",
    requiredData: ["Duty entries", "Rest periods", "Compliance data"],
    category: "regulatory",
  },
];

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Reports" },
    { id: "regulatory", label: "Regulatory" },
    { id: "export", label: "Export" },
    { id: "custom", label: "Custom" },
  ];

  const filteredReports = reportTypes.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
