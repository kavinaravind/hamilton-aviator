"use client";

import * as React from "react";
import { Link } from "expo-router";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@hamilton/ui/components/ui/sidebar";

export function NavHeader({
  header,
}: {
  header: {
    name: string;
    logo: React.ElementType;
    description: string;
  };
}) {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard" onPress={toggleSidebar}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <header.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{header.name}</span>
              <span className="truncate text-xs">{header.description}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
