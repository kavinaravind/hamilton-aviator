"use client";

import * as React from "react";
import { NavUser } from "@/components/navigation//nav-user";
import { NavHeader } from "@/components/navigation/nav-header";
import { NavMain } from "@/components/navigation/nav-main";
import {
  BookOpen,
  LayoutDashboard,
  Plane,
  PlaneTakeoff,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@hamilton/ui/components/ui/sidebar";

const data = {
  user: {
    name: "John Smith",
    email: "john@pilot.com",
    avatar: "/avatars/shadcn.jpg",
  },
  header: {
    name: "Hamilton AI",
    logo: Plane,
    description: "Your Digital Cockpit",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Logbook",
      url: "/dashboard/logbook",
      icon: BookOpen,
    },
    {
      title: "Aircraft",
      url: "/dashboard/aircraft",
      icon: PlaneTakeoff,
    },
    {
      title: "Compliance",
      url: "/dashboard/compliance",
      icon: ShieldCheck,
      items: [
        {
          title: "Duty Log",
          url: "/dashboard/compliance/duty-log",
        },
        {
          title: "Reports",
          url: "/dashboard/compliance/reports",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader header={data.header} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
