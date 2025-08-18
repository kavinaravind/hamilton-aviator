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
import { trpc } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import type { LogbookCreate } from "@hamilton/validators/lib/logbook";

export default function AddFlightPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    trpc.logbook.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.logbook.all.queryFilter());
        Alert.alert("Success", "Flight logged successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      },
      onError: (error) => {
        Alert.alert(
          "Error",
          error instanceof Error ? error.message : "Failed to log flight.",
        );
      },
    }),
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LogbookCreate>({
    defaultValues: {
      date: undefined,
      route: undefined,
      aircraft: undefined,
      duration: undefined,
      tailNumber: undefined,
      departure: {
        airport: undefined,
        time: undefined,
      },
      arrival: {
        airport: undefined,
        time: undefined,
      },
      flightTime: {
        total: undefined,
        pic: undefined,
        sic: undefined,
        solo: undefined,
        dual: undefined,
      },
      conditions: {
        day: undefined,
        night: undefined,
        actualInstrument: undefined,
        simulatedInstrument: undefined,
        crossCountry: undefined,
      },
      landings: {
        day: undefined,
        night: undefined,
      },
      approaches: undefined,
      holds: undefined,
      remarks: undefined,
      instructor: undefined,
      flightType: undefined,
    },
  });

  const handleSave = (data: LogbookCreate) => {
    mutate(data);
  };

  const FormField = ({
    label,
    name,
    placeholder,
    required = false,
    keyboardType = "default",
  }: {
    label: string;
    name: any;
    placeholder: string;
    required?: boolean;
    keyboardType?: "default" | "numeric" | "decimal-pad";
  }) => (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-gray-700">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={required ? { required: true } : {}}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={
              value === undefined || value === null ? "" : value.toString()
            }
            onBlur={onBlur}
            onChangeText={(text) => {
              if (
                keyboardType === "numeric" ||
                keyboardType === "decimal-pad"
              ) {
                onChange(text === "" ? undefined : Number(text));
              } else {
                onChange(text === "" ? undefined : text);
              }
            }}
            keyboardType={keyboardType}
          />
        )}
      />
      {Boolean(
        errors &&
          typeof name === "string" &&
          name
            .split(".")
            .reduce((acc, key) => acc && (acc as any)[key], errors),
      ) &&
        required && (
          <Text className="text-xs text-red-500">This field is required.</Text>
        )}
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
            name="date"
            placeholder="YYYY-MM-DD"
            required
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Departure Airport"
                name="departure.airport"
                placeholder="KLAX"
                required
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Departure Time"
                name="departure.time"
                placeholder="14:30"
              />
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Arrival Airport"
                name="arrival.airport"
                placeholder="KLAS"
                required
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Arrival Time"
                name="arrival.time"
                placeholder="16:45"
              />
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField label="Aircraft" name="aircraft" placeholder="C172" />
            </View>
            <View className="flex-1">
              <FormField
                label="Tail Number"
                name="tailNumber"
                placeholder="N123AB"
              />
            </View>
          </View>
          <FormField
            label="Total Duration"
            name="flightTime.total"
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
                name="flightTime.pic"
                placeholder="2.3"
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="SIC"
                name="flightTime.sic"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Solo"
                name="flightTime.solo"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Dual"
                name="flightTime.dual"
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
                name="conditions.day"
                placeholder="2.3"
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Night"
                name="conditions.night"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Actual Instrument"
                name="conditions.actualInstrument"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Simulated Instrument"
                name="conditions.simulatedInstrument"
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <FormField
            label="Cross Country"
            name="conditions.crossCountry"
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
                name="landings.day"
                placeholder="2"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Night Landings"
                name="landings.night"
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Approaches"
                name="approaches"
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Holds"
                name="holds"
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
            <Controller
              control={control}
              name="flightType"
              render={({ field: { onChange, value } }) => (
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
                      className={`rounded-full px-4 py-2 ${value === type ? "bg-blue-600" : "bg-gray-200"}`}
                      onPress={() => onChange(type)}
                    >
                      <Text
                        className={`text-sm font-medium ${value === type ? "text-white" : "text-gray-700"}`}
                      >
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).replace("-", " ")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>
          <FormField
            label="Instructor (if applicable)"
            name="instructor"
            placeholder="John Smith"
          />
        </View>
        <View className="mt-2 bg-white px-6 py-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">Remarks</Text>
          <Controller
            control={control}
            name="remarks"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="h-24 rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                placeholder="Flight remarks, notes, or comments..."
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                textAlignVertical="top"
              />
            )}
          />
        </View>
        <View className="mb-8 mt-2 bg-white px-6 py-4">
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 rounded-lg bg-primary py-3 shadow-sm active:bg-primary"
              onPress={handleSubmit(handleSave)}
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
