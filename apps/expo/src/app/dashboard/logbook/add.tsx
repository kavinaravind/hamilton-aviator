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
import { trpc } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import type { LogbookCreate } from "@hamilton/validators/lib/logbook";

export default function AddFlightPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
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
      date: new Date(),
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: "Add Flight",
          headerBackTitle: "Logbook",
          gestureEnabled: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSubmit((data) => mutate(data))}
              className="mr-2"
            >
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
          <View className="px-6 pb-2 pt-6">
            <Text className="mb-2 text-2xl font-bold text-gray-900">
              Add Logbook Entry
            </Text>
            <Text className="mb-2 text-base text-gray-600">
              Log a new flight below
            </Text>
          </View>
          <View className="bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Flight Information
            </Text>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Flight Type <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="flightType"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {[
                      "training",
                      "solo",
                      "cross-country",
                      "local",
                      "commercial",
                    ].map((type) => (
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
            {errors.flightType && (
              <Text className="text-xs text-red-500">
                This field is required.
              </Text>
            )}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Date <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="date"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9CA3AF"
                    value={
                      value ? new Date(value).toISOString().slice(0, 10) : ""
                    }
                    onChangeText={(text) => {
                      onChange(text ? new Date(text) : undefined);
                    }}
                  />
                )}
              />
              {errors.date && (
                <Text className="text-xs text-red-500">
                  This field is required.
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Route <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="route"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                    placeholder="Route or waypoints"
                    placeholderTextColor="#9CA3AF"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.route && (
                <Text className="text-xs text-red-500">
                  This field is required.
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Duration <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="duration"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                    placeholder="Block time"
                    placeholderTextColor="#9CA3AF"
                    value={value?.toString() ?? ""}
                    onChangeText={(text) =>
                      onChange(text === "" ? undefined : Number(text))
                    }
                    onBlur={onBlur}
                    keyboardType="decimal-pad"
                  />
                )}
              />
              {errors.duration && (
                <Text className="text-xs text-red-500">
                  This field is required.
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Aircraft <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="aircraft"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                    placeholder="C172"
                    placeholderTextColor="#9CA3AF"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.aircraft && (
                <Text className="text-xs text-red-500">
                  This field is required.
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Tail Number <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="tailNumber"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                    placeholder="N123AB"
                    placeholderTextColor="#9CA3AF"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.tailNumber && (
                <Text className="text-xs text-red-500">
                  This field is required.
                </Text>
              )}
            </View>
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Departure & Arrival
            </Text>
            <View className="flex-row gap-3">
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Departure Airport <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="departure.airport"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="KLAX"
                      placeholderTextColor="#9CA3AF"
                      value={value ?? ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.departure?.airport && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Departure Time <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="departure.time"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="14:30"
                      placeholderTextColor="#9CA3AF"
                      value={
                        value instanceof Date
                          ? value.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : (value ?? "")
                      }
                      onChangeText={(text) => {
                        const formDate = control._formValues?.date;
                        if (formDate && /^\d{1,2}:\d{2}$/.test(text)) {
                          const [hour, minute] = text.split(":");
                          const newDate = new Date(formDate);
                          newDate.setHours(Number(hour), Number(minute), 0, 0);
                          onChange(newDate);
                        } else if (text === "") {
                          onChange(undefined);
                        } else {
                          onChange(text);
                        }
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.departure?.time && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Arrival Airport <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="arrival.airport"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="KLAS"
                      placeholderTextColor="#9CA3AF"
                      value={value ?? ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.arrival?.airport && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Arrival Time <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="arrival.time"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="16:45"
                      placeholderTextColor="#9CA3AF"
                      value={
                        value instanceof Date
                          ? value.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : (value ?? "")
                      }
                      onChangeText={(text) => {
                        const formDate = control._formValues?.date;
                        if (formDate && /^\d{1,2}:\d{2}$/.test(text)) {
                          const [hour, minute] = text.split(":");
                          const newDate = new Date(formDate);
                          newDate.setHours(Number(hour), Number(minute), 0, 0);
                          onChange(newDate);
                        } else if (text === "") {
                          onChange(undefined);
                        } else {
                          onChange(text);
                        }
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.arrival?.time && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Flight Time
            </Text>
            <View className="flex-row gap-3">
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Total Time <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="flightTime.total"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="2.3"
                      placeholderTextColor="#9CA3AF"
                      value={value?.toString() ?? ""}
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                {errors.flightTime?.total && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  PIC <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="flightTime.pic"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="2.3"
                      placeholderTextColor="#9CA3AF"
                      value={value?.toString() ?? ""}
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                {errors.flightTime?.pic && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  SIC <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="flightTime.sic"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="0.0"
                      placeholderTextColor="#9CA3AF"
                      value={value?.toString() ?? ""}
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                {errors.flightTime?.sic && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Solo <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="flightTime.solo"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="0.0"
                      placeholderTextColor="#9CA3AF"
                      value={value?.toString() ?? ""}
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                {errors.flightTime?.solo && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Dual <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="flightTime.dual"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="0.0"
                      placeholderTextColor="#9CA3AF"
                      value={value?.toString() ?? ""}
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                {errors.flightTime?.dual && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
              <View className="flex-1" />
            </View>
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Conditions
            </Text>
            <View className="flex-row gap-3">
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Day <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="conditions.day"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="2.3"
                      placeholderTextColor="#9CA3AF"
                      value={value?.toString() ?? ""}
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                {errors.conditions?.day && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Night <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="conditions.night"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="0.0"
                      placeholderTextColor="#9CA3AF"
                      value={value?.toString() ?? ""}
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                {errors.conditions?.night && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Actual Instrument <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="conditions.actualInstrument"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="0.0"
                      placeholderTextColor="#9CA3AF"
                      value={value?.toString() ?? ""}
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                {errors.conditions?.actualInstrument && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Simulated Instrument <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="conditions.simulatedInstrument"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="0.0"
                      placeholderTextColor="#9CA3AF"
                      value={value?.toString() ?? ""}
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                {errors.conditions?.simulatedInstrument && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Cross Country <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="conditions.crossCountry"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="2.3"
                      placeholderTextColor="#9CA3AF"
                      value={value?.toString() ?? ""}
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                {errors.conditions?.crossCountry && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
              <View className="flex-1" />
            </View>
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Landings, Approaches, Holds
            </Text>
            <View className="flex-row gap-3">
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Day Landings <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="landings.day"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="1"
                      placeholderTextColor="#9CA3AF"
                      value={
                        value === undefined || value === null
                          ? ""
                          : value.toString()
                      }
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="numeric"
                    />
                  )}
                />
                {errors.landings?.day && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Night Landings <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="landings.night"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      value={
                        value === undefined || value === null
                          ? ""
                          : value.toString()
                      }
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="numeric"
                    />
                  )}
                />
                {errors.landings?.night && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Approaches <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="approaches"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="1"
                      placeholderTextColor="#9CA3AF"
                      value={
                        value === undefined || value === null
                          ? ""
                          : value.toString()
                      }
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="numeric"
                    />
                  )}
                />
                {errors.approaches && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
              <View className="mb-4 flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Holds <Text className="text-red-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="holds"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      value={
                        value === undefined || value === null
                          ? ""
                          : value.toString()
                      }
                      onChangeText={(text) =>
                        onChange(text === "" ? undefined : Number(text))
                      }
                      onBlur={onBlur}
                      keyboardType="numeric"
                    />
                  )}
                />
                {errors.holds && (
                  <Text className="text-xs text-red-500">
                    This field is required.
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Additional Information
            </Text>
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Remarks
            </Text>
            <View className="mb-4">
              <Controller
                control={control}
                name="remarks"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="h-24 rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                    placeholder="Flight remarks, notes, or comments..."
                    placeholderTextColor="#9CA3AF"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    textAlignVertical="top"
                  />
                )}
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Instructor (if applicable)
              </Text>
              <Controller
                control={control}
                name="instructor"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                    placeholder="John Smith"
                    placeholderTextColor="#9CA3AF"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
          </View>
          <View className="mb-8 mt-2 bg-white px-6 py-4">
            <View className="flex-row gap-3">
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
              <TouchableOpacity
                className="flex-1 rounded-lg bg-primary py-3 shadow-sm active:bg-primary"
                onPress={handleSubmit((data) => console.log(data))} //mutate(data))}
                disabled={isPending}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="save-outline" size={18} color="white" />
                  <Text className="ml-2 text-base font-semibold text-white">
                    {isPending ? "Saving..." : "Save"}
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
