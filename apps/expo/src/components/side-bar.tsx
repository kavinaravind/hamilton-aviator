"use dom";

import { useEffect } from "react";
import DOMProvider from "@/components/dom-provider";
import { AppSidebar } from "@/components/navigation/app-sidebar";

import { AppNativeIcon } from "@hamilton/ui/components/icons/app-native";
import { Separator } from "@hamilton/ui/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@hamilton/ui/components/ui/sidebar";

function SidebarController({
  onStateChange,
}: {
  onStateChange: (sidebarState: boolean) => void;
}) {
  const { state } = useSidebar();

  useEffect(() => {
    onStateChange(state === "expanded");
  }, [state, onStateChange]);

  return null;
}

export default function SideBar({
  user,
  onStateChange,
  onWebViewReady,
  onLogout,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  onStateChange: (sidebarState: boolean) => void;
  onWebViewReady: (isWebViewReady: boolean) => void;
  onLogout: () => void;
}) {
  // Simulate WebView readiness on mount
  useEffect(() => {
    onWebViewReady(true);
  }, []);

  return (
    <div className="fixed left-0 top-0 h-screen w-screen overflow-hidden">
      <DOMProvider>
        <SidebarProvider>
          <SidebarController onStateChange={onStateChange} />
          <AppSidebar user={user} onLogout={onLogout} />
          <SidebarInset className="!bg-gray-50">
            <header className="flex h-16 shrink-0 items-center gap-2 bg-gray-100 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex w-full items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                    <AppNativeIcon size={24} />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-none text-foreground">
                        Hamilton Aviator
                      </span>
                      <span className="text-xs leading-none text-muted-foreground">
                        Your Digital Cockpit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </SidebarInset>
        </SidebarProvider>
      </DOMProvider>
    </div>
  );
}
