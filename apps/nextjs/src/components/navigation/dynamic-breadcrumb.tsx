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
    { title: "Logbook", href: "/dashboard/logbook" },
  ],
  "/dashboard/logbook/add": [
    { title: "Hamilton Aviator", href: "/dashboard" },
    { title: "Logbook", href: "/dashboard/logbook" },
    { title: "Add Entry" },
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

  let breadcrumbItems: { title: string; href?: string }[];
  if (/^\/dashboard\/logbook\/[\w-]+$/.test(pathname)) {
    breadcrumbItems = [
      { title: "Hamilton Aviator", href: "/dashboard" },
      { title: "Logbook", href: "/dashboard/logbook" },
      { title: "Entry" },
    ];
  } else if (/^\/dashboard\/compliance\/duty-log\/[\w-]+$/.test(pathname)) {
    breadcrumbItems = [
      { title: "Hamilton Aviator", href: "/dashboard" },
      { title: "Compliance" },
      { title: "Duty Log", href: "/dashboard/compliance/duty-log" },
      { title: "Entry" },
    ];
  } else {
    breadcrumbItems = routeMap[pathname] || [
      { title: "Hamilton Aviator", href: "/dashboard" },
      { title: "Dashboard" },
    ];
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {index > 0 &&
                (breadcrumbItems.length === 4 && index === 1 ? (
                  <BreadcrumbSeparator className="hidden md:inline-block" />
                ) : (
                  <BreadcrumbSeparator />
                ))}
              <BreadcrumbItem
                className={
                  breadcrumbItems.length === 4 && index === 0
                    ? "hidden md:inline-block"
                    : ""
                }
              >
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
