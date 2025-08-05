import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Slot } from "expo-router";
import SideBar from "@/components/side-bar";

export default function DashboardLayout() {
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

  useEffect(() => {
    setIsNativeReady({ isReady: true });
  }, []);

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
