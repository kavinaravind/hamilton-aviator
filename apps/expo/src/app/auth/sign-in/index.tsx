import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { authClient } from "@/lib/auth";

// Warm up the browser for better performance
WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      console.log("Starting social sign in with provider:", provider);
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      console.log("Social sign in completed");
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-muted px-4">
      <Text className="mb-8 text-2xl font-bold text-zinc-900">Sign In</Text>
      <View className="w-full max-w-md flex-row">
        <Pressable
          className="m-4 flex-1 items-center rounded-lg bg-indigo-600 px-2 py-4"
          onPress={() => handleSocialSignIn("google")}
        >
          <Text className="font-semibold text-white">Sign in with Google</Text>
        </Pressable>
        <Pressable
          className="m-4 flex-1 items-center rounded-lg bg-zinc-900 px-2 py-4"
          onPress={() => handleSocialSignIn("github")}
        >
          <Text className="font-semibold text-white">Sign in with GitHub</Text>
        </Pressable>
      </View>
      <Text className="mt-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="text-blue-600 underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-blue-600 underline">
          Privacy Policy
        </Link>
        .
      </Text>
    </View>
  );
}
