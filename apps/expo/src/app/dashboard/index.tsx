import { SafeAreaView, Text, View } from "react-native";
import { Link, Stack } from "expo-router";

export default function DashboardPage() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: "Hamilton Dashboard" }} />
      <View className="h-full w-full p-4">
        <Text className="py-2 text-3xl font-bold text-primary">Post</Text>
        <Link href="/dashboard/post/4754b45c-5c81-4465-91f7-9553cc915747">
          <Text className="py-4 text-foreground">Post</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
