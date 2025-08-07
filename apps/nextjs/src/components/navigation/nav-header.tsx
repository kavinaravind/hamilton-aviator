"use client";

import * as React from "react";
import Link from "next/link";

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
  const { toggleSidebar, state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className={state === "collapsed" ? "justify-center" : ""}
        >
          <Link href="/dashboard" onClick={toggleSidebar}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white">
              H
            </div>
            {state !== "collapsed" && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{header.name}</span>
                <span className="truncate text-xs">{header.description}</span>
              </div>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
