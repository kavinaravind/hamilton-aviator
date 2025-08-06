import { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Mock data for report generation
const reportTypes = [
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
  },
  {
    id: "insurance-renewal",
    title: "Insurance Renewal Report",
    description: "Flight experience summary for insurance applications",
    icon: "shield-checkmark",
    color: "#F59E0B",
    estimatedTime: "1-2 minutes",
    requiredData: ["Recent flight time", "Aircraft types", "Total experience"],
  },
  {
    id: "custom-summary",
    title: "Custom Time Summary",
    description:
      "Filtered flight time report (retractable gear, turbine, etc.)",
    icon: "analytics",
    color: "#8B5CF6",
    estimatedTime: "2-4 minutes",
    requiredData: [
      "Flight entries",
      "Aircraft specifications",
      "Custom filters",
    ],
  },
];

const recentReports = [
  {
    id: "1",
    type: "FAA Form 8710-1 Summary",
    generatedDate: "2024-08-03",
    status: "completed",
    fileName: "8710-1_Summary_Aug2024.pdf",
  },
  {
    id: "2",
    type: "Insurance Renewal Report",
    generatedDate: "2024-07-28",
    status: "completed",
    fileName: "Insurance_Report_Jul2024.pdf",
  },
  {
    id: "3",
    type: "Custom Time Summary",
    generatedDate: "2024-07-25",
    status: "completed",
    fileName: "Retractable_Gear_Time_Jul2024.pdf",
  },
];

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleGenerateReport = async (reportId: string, title: string) => {
    setIsGenerating(reportId);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(null);
      Alert.alert(
        "Report Generated",
        `${title} has been generated successfully and saved to your device.`,
        [{ text: "OK" }],
      );
    }, 2000);
  };

  const renderReportType = ({ item }: { item: (typeof reportTypes)[0] }) => (
    <TouchableOpacity
      className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      onPress={() => handleGenerateReport(item.id, item.title)}
      disabled={isGenerating === item.id}
    >
      <View className="flex-row items-start">
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: item.color + "20" }}
        >
          <Ionicons name={item.icon as any} size={24} color={item.color} />
        </View>

        <View className="flex-1">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">
              {item.title}
            </Text>
            {isGenerating === item.id ? (
              <View className="rounded-full bg-blue-100 px-3 py-1">
                <Text className="text-xs font-medium text-blue-600">
                  Generating...
                </Text>
              </View>
            ) : (
              <Ionicons name="download-outline" size={20} color="#9CA3AF" />
            )}
          </View>

          <Text className="mb-2 text-sm text-gray-600">{item.description}</Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-500">
              Est. {item.estimatedTime}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text className="ml-1 text-xs text-green-600">
                {item.requiredData.length} data sources
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecentReport = ({
    item,
  }: {
    item: (typeof recentReports)[0];
  }) => (
    <TouchableOpacity className="mb-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-md font-semibold text-gray-900">
            {item.type}
          </Text>
          <Text className="mt-1 text-sm text-gray-600">
            Generated {item.generatedDate}
          </Text>
          <Text className="mt-1 text-xs text-gray-500">{item.fileName}</Text>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity className="mr-3 p-2">
            <Ionicons name="share-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Ionicons name="download-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="border-b border-gray-200 bg-white px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900">
          Generate Reports
        </Text>
        <Text className="mt-1 text-sm text-gray-600">
          Create official documentation for checkrides, insurance, and career
          advancement
        </Text>
      </View>

      <FlatList
        className="flex-1"
        data={[{ key: "content" }]}
        renderItem={() => (
          <View className="px-4 pt-4">
            {/* Available Reports */}
            <View className="mb-6">
              <Text className="mb-3 text-xl font-bold text-gray-900">
                Available Reports
              </Text>

              <FlatList
                data={reportTypes}
                renderItem={renderReportType}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>

            {/* Recent Reports */}
            <View className="mb-6">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-gray-900">
                  Recent Reports
                </Text>
                <TouchableOpacity>
                  <Text className="font-medium text-primary">View All</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={recentReports}
                renderItem={renderRecentReport}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>

            {/* Help Section */}
            <View className="mb-6 rounded-lg bg-blue-50 p-4">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <View className="ml-3 flex-1">
                  <Text className="mb-1 text-sm font-semibold text-blue-900">
                    Report Generation Tips
                  </Text>
                  <Text className="text-sm text-blue-700">
                    • Ensure your logbook entries are up to date before
                    generating reports{"\n"}• FAA Form 8710-1 summaries are
                    automatically calculated from your flight data{"\n"}• Custom
                    reports can be filtered by aircraft type, date range, or
                    flight conditions
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
