import React from "react";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Clock, Plane, User } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function StatCard({
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

interface FlightStats {
  period: "week" | "month" | "year";
}

export function FlightStats({ period }: FlightStats) {
  const trpc = useTRPC();
  const { data: flightStats } = useSuspenseQuery(
    trpc.dashboard.flightStatistics.queryOptions({ period }),
  );
  return (
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
          title="Period Time"
          value={flightStats.periodTime}
          subtitle="this month"
          icon={Calendar}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Recent Flights"
          value={flightStats.periodFlights.toString()}
          subtitle="last 30 days"
          icon={Plane}
          color="bg-purple-100 text-purple-600"
        />
      </div>
    </div>
  );
}
