import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { authClient } from "@/lib/auth";

import { AppIcon } from "@hamilton/ui/components/icons/app";
import { GitHubIcon, GoogleIcon } from "@hamilton/ui/components/icons/auth";

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
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 items-center">
          <AppIcon size={50} />
          <Text className="mt-4 text-3xl font-bold text-slate-900">
            Hamilton Aviator
          </Text>
          <Text className="mt-1 text-lg text-slate-600">
            Your Digital Cockpit
          </Text>
        </View>
        <View className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/80 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-lg">
          <View style={{ gap: 10 }}>
            <Pressable
              className="flex-row items-center justify-center rounded-md border border-slate-200 bg-white px-6 py-3 shadow-sm active:bg-slate-50 disabled:opacity-50"
              onPress={() => handleSocialSignIn("google")}
            >
              <View className="mr-3">
                <GoogleIcon size={20} />
              </View>
              <Text className="text-base font-medium text-slate-900">
                Sign in with Google
              </Text>
            </Pressable>
            <Pressable
              className="flex-row items-center justify-center rounded-md border border-slate-200 bg-white px-6 py-3 shadow-sm active:bg-slate-50 disabled:opacity-50"
              onPress={() => handleSocialSignIn("github")}
            >
              <View className="mr-3">
                <GitHubIcon size={20} />
              </View>
              <Text className="text-base font-medium text-slate-900">
                Sign in with Github
              </Text>
            </Pressable>
          </View>
        </View>
        <Text className="mt-6 max-w-sm text-center text-sm leading-relaxed text-slate-500">
          {"By continuing, you agree to our "}
          <Text className="font-semibold text-indigo-600">
            Terms of Service
          </Text>
          {" and "}
          <Text className="font-semibold text-indigo-600">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}
