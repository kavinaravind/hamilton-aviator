"use client";

import * as React from "react";
import { Link } from "expo-router";

import { AppIcon } from "@hamilton/ui/components/icons/app";
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
            <div className="flex items-center gap-3">
              <AppIcon size={32} />
              <div className="flex flex-col justify-center">
                <span className="truncate text-base font-medium leading-tight">
                  {header.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {header.description}
                </span>
              </div>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
