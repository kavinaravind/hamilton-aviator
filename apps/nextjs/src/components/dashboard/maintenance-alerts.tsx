import React, { Suspense } from "react";
import Link from "next/link";
import { getAlertVariant } from "@/lib/dashboard";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertTriangle, ChevronRight } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Badge } from "@hamilton/ui/components/ui/badge";
import { Button } from "@hamilton/ui/components/ui/button";

export function MaintenanceAlerts() {
  const trpc = useTRPC();
  const { data: maintenanceAlerts } = useSuspenseQuery(
    trpc.dashboard.maintenanceAlerts.queryOptions(),
  );

  return (
    <Suspense fallback={<LoadingSkeleton />}>
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
                  <p className="text-sm font-semibold">{alert.tailNumber}</p>
                  {alert.urgent && (
                    <Badge variant={getAlertVariant(alert.urgent)}>
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{alert.type}</p>
                <p className="text-xs text-muted-foreground">
                  Due in {`${alert.dueInDays} days`}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
}
