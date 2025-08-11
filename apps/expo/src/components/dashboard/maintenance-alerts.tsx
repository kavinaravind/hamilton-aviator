import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { trpc } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

export function MaintenanceAlerts() {
  const {
    data: maintenanceAlerts,
    isPending,
    isError,
    error,
  } = useQuery(trpc.dashboard.maintenanceAlerts.queryOptions());

  console.log(maintenanceAlerts);

  return (
    <View className="mb-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">
          Maintenance Alerts
        </Text>
        <Link href="/dashboard/aircraft" asChild>
          <TouchableOpacity>
            <Text className="font-medium text-primary">View All</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {isPending && <Text>Loading maintenance alerts...</Text>}
      {isError && (
        <View>
          <Text>Error loading maintenance alerts.</Text>
          <Text selectable className="text-xs text-red-500">
            {error?.message}
          </Text>
        </View>
      )}
      {!isPending &&
        !isError &&
        maintenanceAlerts?.map((alert: any) => (
          <Link key={alert.id} href={`/dashboard/aircraft/${alert.id}`} asChild>
            <TouchableOpacity className="mb-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <View className="flex-row items-center">
                <View
                  className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: alert.urgent ? "#FEF2F2" : "#F3F4F6",
                  }}
                >
                  <Ionicons
                    name="warning"
                    size={16}
                    color={alert.urgent ? "#EF4444" : "#6B7280"}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-sm font-semibold text-gray-900">
                      {alert.tailNumber}
                    </Text>
                    {alert.urgent && (
                      <View className="ml-2 rounded-full bg-red-100 px-2 py-1">
                        <Text className="text-xs font-medium text-red-600">
                          Urgent
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-gray-600">{alert.type}</Text>
                  <Text className="text-xs text-gray-500">
                    Due in {alert.dueInDays} days
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </Link>
        ))}
    </View>
  );
}
