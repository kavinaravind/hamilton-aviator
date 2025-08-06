import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Slot, useRouter } from "expo-router";
import SideBar from "@/components/side-bar";
import { authClient } from "@/lib/auth";

export default function DashboardLayout() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [sidebarState, setSidebarState] = useState<{ isOpen: boolean } | null>(
    null,
  );
  const [isWebViewReady, setIsWebViewReady] = useState<{
    isReady: boolean;
  } | null>(null);
  const [isNativeReady, setIsNativeReady] = useState<{
    isReady: boolean;
  } | null>(null);

  const isAppReady = isWebViewReady && isNativeReady;

  const handleLogout = async () => {
    try {
      console.log("Logout initiated from dashboard layout");
      await authClient.signOut();
      router.replace("/auth/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    setIsNativeReady({ isReady: true });
  }, []);

  console.log("Dashboard ready states:", {
    isWebViewReady,
    isNativeReady,
    isAppReady,
    session: session?.user,
    isPending,
  });

  // Don't render if we're still loading session
  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect if not authenticated
  if (!session) {
    router.replace("/auth/sign-in");
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
          zIndex: sidebarState?.isOpen ? 1000 : 0,
          pointerEvents: sidebarState?.isOpen ? "auto" : "box-none",
          opacity: isAppReady ? 1 : 0,
        }}
      >
        <SideBar
          user={session.user}
          onWebViewReady={async ({ isReady }) => {
            if (isWebViewReady?.isReady !== isReady) {
              setIsWebViewReady({ isReady });
            }
          }}
          onStateChange={async ({ isOpen }) => {
            if (sidebarState?.isOpen !== isOpen) {
              setSidebarState({ isOpen });
            }
          }}
          onLogout={handleLogout}
        />
      </View>
      {!isAppReady && (
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
      {isAppReady && (
        <View
          style={{
            flex: 1,
            paddingTop: 108,
            paddingLeft: 16,
          }}
        >
          <Slot />
        </View>
      )}
    </View>
  );
}
