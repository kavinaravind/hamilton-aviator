"use client";

import React from "react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@hamilton/ui/components/ui/breadcrumb";

// Define route mappings for breadcrumbs
const routeMap: Record<string, { title: string; href?: string }[]> = {
  "/dashboard": [
    { title: "Hamilton Aviator", href: "/dashboard" },
    { title: "Dashboard" },
  ],
  "/dashboard/aircraft": [
    { title: "Hamilton Aviator", href: "/dashboard" },
    { title: "Aircraft" },
  ],
  "/dashboard/logbook": [
    { title: "Hamilton Aviator", href: "/dashboard" },
    { title: "Logbook" },
  ],
  "/dashboard/compliance/duty-log": [
    { title: "Hamilton Aviator", href: "/dashboard" },
    { title: "Compliance" },
    { title: "Duty Log" },
  ],
  "/dashboard/compliance/duty-log/add": [
    { title: "Hamilton Aviator", href: "/dashboard" },
    { title: "Compliance" },
    { title: "Duty Log", href: "/dashboard/compliance/duty-log" },
    { title: "Add Entry" },
  ],
  "/dashboard/compliance/reports": [
    { title: "Hamilton Aviator", href: "/dashboard" },
    { title: "Compliance" },
    { title: "Reports" },
  ],
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Get breadcrumb items for current path
  const breadcrumbItems = routeMap[pathname] || [
    { title: "Hamilton Aviator", href: "/dashboard" },
    { title: "Dashboard" },
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
