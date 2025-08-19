import React from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import type {
  DutyLogCreate,
  DutyLogTrainingType,
  DutyLogType,
} from "@hamilton/validators/lib/compliance";
import {
  getDutyTypeColor,
  getDutyTypeIcon,
  getDutyTypeText,
} from "@hamilton/validators/lib/compliance";

const dutyTypes: DutyLogType[] = [
  "flight-duty",
  "standby",
  "training",
  "maintenance",
];

export default function AddDutyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    trpc.dutyLog.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.dutyLog.all.queryFilter());
        Alert.alert("Success", "Duty entry has been created", [
          { text: "OK", onPress: () => router.back() },
        ]);
      },
      onError: (error) => {
        Alert.alert(
          "Error",
          error instanceof Error
            ? error.message
            : "Failed to create duty entry.",
        );
      },
    }),
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DutyLogCreate>({
    defaultValues: {
      type: undefined,
      description: null,
      startTime: new Date(),
      endTime: null,
      duration: null,
      status: undefined,
      location: null,
      crew: null,
      aircraft: null,
      flightNumber: null,
      instructor: null,
      trainingType: null,
      notes: null,
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: "Add Duty Entry",
          headerBackTitle: "Duty Log",
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
              Add Duty Entry
            </Text>
            <Text className="mb-2 text-base text-gray-600">
              Log a new duty, standby, or training event below
            </Text>
          </View>
          <View className="bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Duty Type <Text className="text-red-500">*</Text>
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {dutyTypes.map((type: DutyLogType) => {
                const selectedType = watch("type");
                const isSelected = selectedType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={{ width: "48%", marginBottom: 8 }}
                    className={`flex-row items-center rounded-md border px-2 py-2 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onPress={() => setValue("type", type)}
                  >
                    <View
                      className="mr-2 h-7 w-7 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: isSelected
                          ? getDutyTypeColor(type)
                          : getDutyTypeColor(type) + "20",
                      }}
                    >
                      <Ionicons
                        name={getDutyTypeIcon(type) as any}
                        size={14}
                        color={isSelected ? "white" : getDutyTypeColor(type)}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`text-sm font-medium ${
                          isSelected ? "text-blue-900" : "text-gray-900"
                        }`}
                      >
                        {getDutyTypeText(type)}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#3B82F6"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Basic Information
            </Text>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Description
              </Text>
              <Controller
                control={control}
                name="description"
                rules={{ required: true }}
                render={({ field }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                    placeholder="Enter duty description"
                    value={field.value ?? ""}
                    onChangeText={(text: string) =>
                      field.onChange(text === "" ? null : text)
                    }
                    onBlur={field.onBlur}
                    multiline
                    numberOfLines={2}
                  />
                )}
              />
              {errors.description && (
                <Text className="text-xs text-red-500">
                  This field is required.
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Status <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {["active", "completed"].map((status) => (
                      <TouchableOpacity
                        key={status}
                        className={`rounded-full px-4 py-2 ${value === status ? "bg-blue-600" : "bg-gray-200"}`}
                        onPress={() => onChange(status)}
                      >
                        <Text
                          className={`text-sm font-medium ${value === status ? "text-white" : "text-gray-700"}`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Time Information
            </Text>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Start Time <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="startTime"
                rules={{ required: true }}
                render={({ field }) => {
                  const [show, setShow] = React.useState(false);
                  const [mode, setMode] = React.useState<"date" | "time">(
                    "date",
                  );
                  const showMode = (currentMode: "date" | "time") => {
                    setShow(true);
                    setMode(currentMode);
                  };
                  const onChange = (event: any, selectedDate?: Date) => {
                    setShow(false);
                    if (event?.type === "set" && selectedDate) {
                      let newDate = new Date(selectedDate);
                      if (field.value && mode === "date") {
                        newDate.setHours(
                          field.value.getHours(),
                          field.value.getMinutes(),
                        );
                      }
                      if (field.value && mode === "time") {
                        newDate.setFullYear(
                          field.value.getFullYear(),
                          field.value.getMonth(),
                          field.value.getDate(),
                        );
                      }
                      field.onChange(newDate);
                    }
                  };
                  return (
                    <>
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TouchableOpacity
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-3"
                          onPress={() => showMode("date")}
                        >
                          <Text className="text-base text-gray-900">
                            {field.value
                              ? field.value.toLocaleDateString()
                              : "Select date"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-3"
                          onPress={() => showMode("time")}
                        >
                          <Text className="text-base text-gray-900">
                            {field.value
                              ? field.value.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Select time"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {show && (
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#fff",
                          }}
                        >
                          <DateTimePicker
                            value={field.value || new Date()}
                            mode={mode}
                            is24Hour={true}
                            display={
                              Platform.OS === "ios" ? "inline" : "default"
                            }
                            onChange={onChange}
                          />
                        </View>
                      )}
                    </>
                  );
                }}
              />
              {errors.startTime && (
                <Text className="text-xs text-red-500">
                  {errors.startTime.message || "This field is required."}
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                End Time
              </Text>
              <Controller
                control={control}
                name="endTime"
                render={({ field }) => {
                  const [show, setShow] = React.useState(false);
                  const [mode, setMode] = React.useState<"date" | "time">(
                    "date",
                  );
                  const showMode = (currentMode: "date" | "time") => {
                    setShow(true);
                    setMode(currentMode);
                  };
                  const onChange = (event: any, selectedDate?: Date) => {
                    setShow(false);
                    if (event?.type === "set" && selectedDate) {
                      let newDate = new Date(selectedDate);
                      if (field.value && mode === "date") {
                        newDate.setHours(
                          field.value.getHours(),
                          field.value.getMinutes(),
                        );
                      }
                      if (field.value && mode === "time") {
                        newDate.setFullYear(
                          field.value.getFullYear(),
                          field.value.getMonth(),
                          field.value.getDate(),
                        );
                      }
                      field.onChange(newDate);
                    }
                  };
                  return (
                    <>
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TouchableOpacity
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-3"
                          onPress={() => showMode("date")}
                        >
                          <Text className="text-base text-gray-900">
                            {field.value
                              ? field.value.toLocaleDateString()
                              : "Select date"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-3"
                          onPress={() => showMode("time")}
                        >
                          <Text className="text-base text-gray-900">
                            {field.value
                              ? field.value.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Select time"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {show && (
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#fff",
                          }}
                        >
                          <DateTimePicker
                            value={field.value || new Date()}
                            mode={mode}
                            is24Hour={true}
                            display={
                              Platform.OS === "ios" ? "inline" : "default"
                            }
                            onChange={onChange}
                          />
                        </View>
                      )}
                    </>
                  );
                }}
              />
            </View>
          </View>
          <View className="mt-2 bg-white px-6 py-4">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Additional Information
            </Text>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Location
              </Text>
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                    placeholder="Location (optional)"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Crew
              </Text>
              <Controller
                control={control}
                name="crew"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                    placeholder="Crew (optional)"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Aircraft
              </Text>
              <Controller
                control={control}
                name="aircraft"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                    placeholder="Aircraft (optional)"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Flight Number
              </Text>
              <Controller
                control={control}
                name="flightNumber"
                render={({ field }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                    placeholder="Flight Number (optional)"
                    value={field.value ?? ""}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Instructor
              </Text>
              <Controller
                control={control}
                name="instructor"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                    placeholder="Instructor (optional)"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Training Type
              </Text>
              <Controller
                control={control}
                name="trainingType"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {(
                      [
                        "simulator",
                        "checkride",
                        "recurrent",
                        "initial",
                        "ground-school",
                        "flight-review",
                      ] as DutyLogTrainingType[]
                    ).map((type) => {
                      const label = type
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());
                      return (
                        <TouchableOpacity
                          key={type}
                          className={`rounded-full px-4 py-2 ${value === type ? "bg-blue-600" : "bg-gray-200"}`}
                          onPress={() => onChange(type)}
                        >
                          <Text
                            className={`text-sm font-medium ${value === type ? "text-white" : "text-gray-700"}`}
                          >
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Notes
              </Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                    placeholder="Additional notes or comments"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={3}
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
                onPress={handleSubmit((data) => mutate(data))}
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
