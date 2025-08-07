import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const flightTimeData = {
  totalTime: "1,247.3",
  pic: "892.1",
  night: "156.4",
  instrument: "98.7",
  crossCountry: "543.2",
};

const maintenanceAlerts = [
  {
    aircraftId: "N123AB",
    type: "100-Hour Inspection",
    dueInHours: 7.8,
    urgent: true,
  },
  {
    aircraftId: "N456CD",
    type: "Annual Inspection",
    dueInDays: 45,
    urgent: false,
  },
  { aircraftId: "N123AB", type: "Oil Change", dueInHours: 23.5, urgent: false },
];

const recentFlights = [
  {
    id: "1",
    date: "2024-08-05",
    route: "KLAX - KLAS",
    aircraft: "N123AB",
    duration: "2.3",
  },
  {
    id: "2",
    date: "2024-08-03",
    route: "KPHX - KLAX",
    aircraft: "N456CD",
    duration: "3.1",
  },
  {
    id: "3",
    date: "2024-07-30",
    route: "KLAS - KPHX",
    aircraft: "N123AB",
    duration: "1.8",
  },
];

export default function DashboardPage() {
  const getCurrencyStatus = (item: typeof currencyData.passenger90Day) => {
    if (!item.current) return { color: "#EF4444", text: "Expired" };
    if (item.daysRemaining <= 7)
      return { color: "#F59E0B", text: "Expires Soon" };
    return { color: "#10B981", text: "Current" };
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: "Hamilton Dashboard" }} />
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="mb-6">
          <Text className="mb-3 text-xl font-bold text-gray-900">
            Flight Time Summary
          </Text>
          <Link href="/dashboard/logbook/totals" asChild>
            <TouchableOpacity className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">
                  Total Flight Time
                </Text>
                <Text className="text-2xl font-bold text-primary">
                  {flightTimeData.totalTime}h
                </Text>
              </View>

              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-sm text-gray-500">PIC</Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {flightTimeData.pic}h
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm text-gray-500">Night</Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {flightTimeData.night}h
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm text-gray-500">Instrument</Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {flightTimeData.instrument}h
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
        <View className="mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">
              Maintenance Alerts
            </Text>
            <Link href="/dashboard/aircraft" asChild>
              <TouchableOpacity>
                <Text className="font-medium text-primary">View All</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {maintenanceAlerts.map((alert, index) => (
            <Link
              key={index}
              href={`/dashboard/aircraft/${alert.aircraftId}`}
              asChild
            >
              <TouchableOpacity className="mb-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="mb-1 flex-row items-center">
                      <Text className="text-lg font-semibold text-gray-900">
                        {alert.aircraftId}
                      </Text>
                      {alert.urgent && (
                        <View className="ml-2 rounded-full bg-red-100 px-2 py-1">
                          <Text className="text-xs font-medium text-red-600">
                            Urgent
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-gray-600">{alert.type}</Text>
                    <Text className="text-sm text-gray-500">
                      Due in{" "}
                      {alert.dueInHours
                        ? `${alert.dueInHours} hrs`
                        : `${alert.dueInDays} days`}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
        <View className="mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">
              Recent Flights
            </Text>
            <Link href="/dashboard/logbook" asChild>
              <TouchableOpacity>
                <Text className="font-medium text-primary">View All</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {recentFlights.map((flight) => (
            <Link
              key={flight.id}
              href={`/dashboard/logbook/flight/${flight.id}`}
              asChild
            >
              <TouchableOpacity className="mb-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {flight.route}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {flight.aircraft} • {flight.date}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-primary">
                      {flight.duration}h
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#9CA3AF"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
