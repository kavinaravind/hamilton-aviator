import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { DynamicBreadcrumb } from "@/components/navigation/dynamic-breadcrumb";
import { getSession } from "@/lib/auth/server";
import { HydrateClient } from "@/lib/trpc/server";
import { ClientAuthProvider } from "@/providers/client-auth-provider";

import { Separator } from "@hamilton/ui/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@hamilton/ui/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Hamilton Aviator",
  description: "Your digital copilot",
};

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  const session = await getSession();
  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        variant="inset"
        user={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? undefined,
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>
        <ClientAuthProvider>
          <HydrateClient>{children}</HydrateClient>
        </ClientAuthProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
