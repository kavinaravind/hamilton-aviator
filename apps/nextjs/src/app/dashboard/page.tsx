"use client";

import type {
  AircraftStatus,
  DutyCompliance,
  FlightStats,
  MaintenanceAlert,
  Period,
  RecentFlight,
  UpcomingItem,
} from "@/lib/dashboard";
import React, { useState } from "react";
import Link from "next/link";
import { formatDate, getAlertVariant } from "@/lib/dashboard";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  Plane,
  Timer,
  User,
} from "lucide-react";

import { Badge } from "@hamilton/ui/components/ui/badge";
import { Button } from "@hamilton/ui/components/ui/button";

const flightStats: FlightStats = {
  totalTime: "1,247.3",
  pic: "892.1",
  monthlyTime: "18.7",
  last30Days: 12,
};
const aircraftStatus: AircraftStatus = {
  total: 4,
  airworthy: 2,
  maintenance: 1,
  maintenanceSoon: 1,
};
const dutyCompliance: DutyCompliance = {
  activeDuty: 1,
  monthlyHours: "87.5",
  remainingDuty: "72.5",
  nextRest: "14:30",
};
const maintenanceAlerts: MaintenanceAlert[] = [
  {
    id: "1",
    aircraftId: "N123AB",
    type: "100-Hour Inspection",
    dueInHours: 7.8,
    urgent: true,
  },
  {
    id: "2",
    aircraftId: "N456CD",
    type: "Annual Inspection",
    dueInDays: 45,
    urgent: false,
  },
];
const recentFlights: RecentFlight[] = [
  {
    id: "1",
    date: "2025-08-05",
    route: "KLAX - KLAS",
    aircraft: "N123AB",
    duration: "2.3",
    type: "Cross-Country",
  },
  {
    id: "2",
    date: "2025-08-03",
    route: "KPHX - KLAX",
    aircraft: "N456CD",
    duration: "3.1",
    type: "Commercial",
  },
];
const upcomingItems: UpcomingItem[] = [
  {
    id: "1",
    type: "checkride",
    title: "Commercial Pilot Checkride",
    date: "2025-08-15",
    location: "KLAX",
    urgent: true,
  },
  {
    id: "2",
    type: "training",
    title: "Recurrent Training - Simulator",
    date: "2025-08-20",
    location: "Training Center",
    urgent: false,
  },
];
const periods: Period[] = [
  { id: "week", label: "7 Days" },
  { id: "month", label: "30 Days" },
  { id: "year", label: "1 Year" },
];

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={`rounded-full p-2 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week");

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">
            Flight operations and compliance overview
          </p>
        </div>
        <Link href="/dashboard/compliance/duty-log/add">
          <Button>Quick Log</Button>
        </Link>
      </div>
      <div className="flex space-x-2">
        {periods.map((period) => (
          <Button
            key={period.id}
            variant={selectedPeriod === period.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period.id)}
          >
            {period.label}
          </Button>
        ))}
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Flight Statistics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Time"
            value={flightStats.totalTime}
            subtitle="hours logged"
            icon={Clock}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="PIC Time"
            value={flightStats.pic}
            subtitle="pilot in command"
            icon={User}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Monthly Time"
            value={flightStats.monthlyTime}
            subtitle="this month"
            icon={Calendar}
            color="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            title="Recent Flights"
            value={flightStats.last30Days.toString()}
            subtitle="last 30 days"
            icon={Plane}
            color="bg-purple-100 text-purple-600"
          />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Aircraft & Compliance</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard/aircraft">
            <div className="rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Aircraft Fleet
                  </p>
                  <p className="text-2xl font-bold">{aircraftStatus.total}</p>
                  <p className="text-xs text-muted-foreground">
                    {aircraftStatus.airworthy} airworthy,{" "}
                    {aircraftStatus.maintenance} in maintenance
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <Plane className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/compliance/duty-log">
            <div className="rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Duty Hours
                  </p>
                  <p className="text-2xl font-bold">
                    {dutyCompliance.monthlyHours}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dutyCompliance.remainingDuty} remaining
                  </p>
                </div>
                <div className="rounded-full bg-red-100 p-2 text-red-600">
                  <Timer className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Maintenance Alerts</h2>
          <Link href="/dashboard/aircraft">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-2">
          {maintenanceAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold">{alert.aircraftId}</p>
                  {alert.urgent && (
                    <Badge variant={getAlertVariant(alert.urgent)}>
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{alert.type}</p>
                <p className="text-xs text-muted-foreground">
                  Due in{" "}
                  {alert.dueInHours
                    ? `${alert.dueInHours} hrs`
                    : `${alert.dueInDays} days`}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Flights</h2>
          <Link href="/dashboard/logbook">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-2">
          {recentFlights.map((flight) => (
            <Link
              key={flight.id}
              href={`/dashboard/logbook/flight/${flight.id}`}
            >
              <div className="flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Plane className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold">{flight.route}</p>
                  <p className="text-xs text-muted-foreground">
                    {flight.aircraft} • {flight.type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(flight.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">
                    {flight.duration}h
                  </p>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <div className="space-y-2">
          {upcomingItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  item.type === "checkride"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {item.type === "checkride" ? (
                  <GraduationCap className="h-4 w-4" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold">{item.title}</p>
                  {item.urgent && <Badge variant="secondary">Soon</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{item.location}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(item.date)}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
