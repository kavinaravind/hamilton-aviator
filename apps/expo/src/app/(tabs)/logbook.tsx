import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogBook() {
  return (
    <SafeAreaView className="bg-background">
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-3xl font-bold text-primary">
          Log Book
        </Text>
        <View className="py-2">
          <Text className="font-semibold italic text-primary">Logs</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
