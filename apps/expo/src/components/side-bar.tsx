"use dom";

import { useEffect } from "react";
import DOMProvider from "@/components/dom-provider";
import { AppSidebar } from "@/components/navigation/app-sidebar";

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
  onStateChange: (sidebarState: { isOpen: boolean }) => void;
}) {
  const { state } = useSidebar();

  useEffect(() => {
    onStateChange({ isOpen: state === "expanded" });
  }, [state, onStateChange]);

  return null;
}

export default function SideBar({
  user,
  onStateChange,
  onWebViewReady,
  onLogout,
}: {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  onStateChange: (sidebarState: { isOpen: boolean }) => void;
  onWebViewReady: (isWebViewReady: { isReady: boolean }) => void;
  onLogout?: () => void;
}) {
  // Simulate WebView readiness on mount
  useEffect(() => {
    onWebViewReady({ isReady: true });
  }, []);

  return (
    <DOMProvider>
      <SidebarProvider>
        <SidebarController onStateChange={onStateChange} />
        <AppSidebar user={user} onLogout={onLogout} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white">
                    H
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-none text-foreground">
                      Hamilton Path
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
  );
}
