"use client";

import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

import type { LogbookCreate } from "@hamilton/validators/lib/logbook";
import { Button } from "@hamilton/ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@hamilton/ui/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@hamilton/ui/components/ui/form";
import { Input } from "@hamilton/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hamilton/ui/components/ui/select";
import { Textarea } from "@hamilton/ui/components/ui/textarea";
import { toast } from "@hamilton/ui/components/ui/toast";
import {
  LogbookCreateSchema,
  LogbookFlightTypeEnum,
} from "@hamilton/validators/lib/logbook";

export default function AddLogbookEntryPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<LogbookCreate>({
    resolver: zodResolver(LogbookCreateSchema as any),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      route: "",
      aircraft: "",
      duration: "",
      tailNumber: "",
      departure: { airport: "", time: "" },
      arrival: { airport: "", time: "" },
      flightTime: { total: "", pic: "", sic: "", solo: "", dual: "" },
      conditions: {
        day: "",
        night: "",
        actualInstrument: "",
        simulatedInstrument: "",
        crossCountry: "",
      },
      landings: { day: 0, night: 0 },
      approaches: 0,
      holds: 0,
      remarks: "",
      instructor: "",
      flightType: LogbookFlightTypeEnum.enum.training,
    },
  });

  const createLogbookEntry = useMutation(
    trpc.logbook.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.logbook.pathFilter());
        router.push("/dashboard/logbook");
      },
      onError: (err: any) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to add a logbook entry"
            : "Failed to add logbook entry",
        );
      },
    }),
  );

  return (
    <div className="flex-1 bg-white p-4 pt-4 dark:bg-gray-950 sm:p-8 sm:pt-6">
      <Form {...form}>
        <form
          className="mx-auto w-full max-w-2xl space-y-8"
          onSubmit={form.handleSubmit((data) =>
            createLogbookEntry.mutate(data),
          )}
        >
          {/* Section: Basic Info */}
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Add Flight Log Entry
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 rounded-b-xl pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aircraft"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Aircraft (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tailNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Tail Number (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Route (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section: Departure/Arrival */}
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Departure & Arrival
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 rounded-b-xl pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="departure.airport"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Departure Airport (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departure.time"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="Departure Time (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrival.airport"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Arrival Airport (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrival.time"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="Arrival Time (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section: Flight Time */}
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Flight Time
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 rounded-b-xl pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="flightTime.total"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Total (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="flightTime.pic"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="PIC (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="flightTime.sic"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="SIC (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="flightTime.solo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Solo (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="flightTime.dual"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Dual (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section: Conditions */}
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Conditions
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 rounded-b-xl pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="conditions.day"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Day (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conditions.night"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Night (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conditions.actualInstrument"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Actual Instrument (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conditions.simulatedInstrument"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Simulated Instrument (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conditions.crossCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Cross Country (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section: Landings, Approaches, Holds */}
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Landings, Approaches, Holds
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 rounded-b-xl pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="landings.day"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Landings (Day) (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="landings.night"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Landings (Night) (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approaches"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Approaches (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="holds"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Holds (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section: Remarks, Instructor, Flight Type */}
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Remarks & Details
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 rounded-b-xl pt-6">
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Remarks (optional)"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Instructor (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flightType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Flight Type (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            LogbookFlightTypeEnum.options ??
                            Object.values(LogbookFlightTypeEnum)
                          ).map((type: string) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Save/Cancel Buttons */}
          <div className="mt-4 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              size="sm"
              className="px-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createLogbookEntry.isPending}
              size="sm"
              className="px-3"
            >
              {createLogbookEntry.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
