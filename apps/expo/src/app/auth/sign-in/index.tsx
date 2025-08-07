import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { authClient } from "@/lib/auth";

// Warm up the browser for better performance
WebBrowser.maybeCompleteAuthSession();

const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 256 262">
    <Path
      fill="#4285F4"
      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
    />
    <Path
      fill="#34A853"
      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
    />
    <Path
      fill="#FBBC05"
      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
    />
    <Path
      fill="#EB4335"
      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
    />
  </Svg>
);

const GitHubIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#181717"
      d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
    />
  </Svg>
);

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
          <LinearGradient
            colors={["#2563eb", "#9333ea"]}
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              shadowColor: "#3b82f6",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 25,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#ffffff",
                backgroundColor: "transparent",
              }}
            >
              H
            </Text>
          </LinearGradient>
          <Text className="text-3xl font-bold text-slate-900">Hamilton AI</Text>
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
