"use client";

import * as React from "react";
import Link from "next/link";

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
  const { toggleSidebar, state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className={state === "collapsed" ? "justify-center" : ""}
        >
          <Link
            href="/dashboard"
            onClick={toggleSidebar}
            className="flex items-center gap-3"
          >
            <div className="flex h-6 w-6 items-center justify-center">
              <AppIcon size={32} />
            </div>
            {state !== "collapsed" && (
              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-semibold">{header.name}</span>
                <span className="truncate text-xs opacity-80">
                  {header.description}
                </span>
              </div>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
