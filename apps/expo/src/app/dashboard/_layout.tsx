import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import SideBar from "@/components/side-bar";
import { authClient } from "@/lib/auth";

export default function DashboardLayout() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [sidebarState, setSidebarState] = useState<boolean>(false);
  const [sidebarZIndex, setSidebarZIndex] = useState<number>(0);

  const [isWebViewReady, setIsWebViewReady] = useState<boolean>(false);
  const [isNativeReady, setIsNativeReady] = useState<boolean>(false);

  const isAppReady = isWebViewReady && isNativeReady;

  useEffect(() => {
    setIsNativeReady(true);
  }, []);

  useEffect(() => {
    if (sidebarState) {
      setSidebarZIndex(100);
    } else {
      const timeout = setTimeout(() => {
        setSidebarZIndex(0);
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [sidebarState]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/sign-in");
    }
  }, [session, isPending, router]);

  console.debug("Dashboard ready states:", {
    isWebViewReady,
    isNativeReady,
    isAppReady,
    session: session?.user,
    isPending,
  });

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!session) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: sidebarZIndex,
          pointerEvents: sidebarState ? "auto" : "box-none",
          opacity: isAppReady ? 1 : 0,
        }}
      >
        <SideBar
          user={session.user}
          onWebViewReady={async (isReady) => {
            if (isWebViewReady !== isReady) setIsWebViewReady(isReady);
          }}
          onStateChange={async (isOpen) => {
            if (sidebarState !== isOpen) setSidebarState(isOpen);
          }}
          onLogout={async () => {
            try {
              await authClient.signOut();
              router.replace("/auth/sign-in");
            } catch (error) {
              console.error("Logout failed:", error);
            }
          }}
        />
      </View>
      {isAppReady ? (
        <View
          style={{
            flex: 1,
            paddingTop: 116,
          }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
