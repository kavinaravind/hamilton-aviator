"use dom";

import { useEffect } from "react";
import DOMProvider from "@/components/dom-provider";
import { AppSidebar } from "@/components/navigation/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@hamilton/ui/components/ui/breadcrumb";
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
    <div className="fixed left-0 top-0 h-screen w-screen overflow-hidden">
      <DOMProvider>
        <SidebarProvider>
          <SidebarController onStateChange={onStateChange} />
          <AppSidebar user={user} onLogout={onLogout} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Hamilton AI</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Hamilton Path</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
          </SidebarInset>
        </SidebarProvider>
      </DOMProvider>
    </div>
  );
}
