import { View } from "react-native";
import { Slot } from "expo-router";

export default function SignInLayout() {
  return (
    <View className="flex min-h-screen flex-1 items-center justify-center bg-background">
      <Slot />
    </View>
  );
}
