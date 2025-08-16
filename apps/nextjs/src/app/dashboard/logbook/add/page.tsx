"use client";

import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

import type { LogbookCreate } from "@hamilton/validators/lib/logbook";
import { Button } from "@hamilton/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hamilton/ui/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
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
  const form = useForm<LogbookCreate, LogbookCreate>({
    schema: LogbookCreateSchema,
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
        toast.success("Logbook entry added successfully", {
          position: "top-right",
        });
        router.push("/dashboard/logbook");
      },
      onError: (err: any) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to add a logbook entry"
            : "Failed to add logbook entry",
          { position: "top-right" },
        );
      },
    }),
  );

  return (
    <div className="flex-1 bg-white p-4 pt-4 dark:bg-gray-950 sm:p-8 sm:pt-6">
      <Form {...form}>
        <form
          className="mx-auto w-full max-w-2xl"
          onSubmit={form.handleSubmit((data) =>
            createLogbookEntry.mutate(data),
          )}
        >
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Flight Log Entry</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  type="button"
                  className="hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <CardDescription>Enter all flight details below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Info */}
              <CardTitle className="text-lg">Flight Details</CardTitle>
              <hr className="border-2 border-gray-200 dark:border-gray-800" />
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
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
                      <FormLabel>Aircraft</FormLabel>
                      <FormDescription>
                        Type/model of aircraft (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Tail Number</FormLabel>
                      <FormDescription>
                        Aircraft registration (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Route</FormLabel>
                      <FormDescription>
                        Flight route or waypoints (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Departure & Arrival */}
              <CardTitle className="text-lg">Departure & Arrival</CardTitle>
              <hr className="border-2 border-gray-200 dark:border-gray-800" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="departure.airport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Airport</FormLabel>
                      <FormDescription>
                        Origin airport (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Departure Time</FormLabel>
                      <FormDescription>
                        Time of departure (optional)
                      </FormDescription>
                      <FormControl>
                        <Input type="time" {...field} />
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
                      <FormLabel>Arrival Airport</FormLabel>
                      <FormDescription>
                        Destination airport (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Arrival Time</FormLabel>
                      <FormDescription>
                        Time of arrival (optional)
                      </FormDescription>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Flight Time */}
              <CardTitle className="text-lg">Flight Time</CardTitle>
              <hr className="border-2 border-gray-200 dark:border-gray-800" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="flightTime.total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Time</FormLabel>
                      <FormDescription>
                        Total flight time (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>PIC</FormLabel>
                      <FormDescription>
                        Pilot in command time (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>SIC</FormLabel>
                      <FormDescription>
                        Second in command time (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Solo</FormLabel>
                      <FormDescription>
                        Solo flight time (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Dual</FormLabel>
                      <FormDescription>
                        Dual flight instruction time (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Conditions */}
              <CardTitle className="text-lg">Conditions</CardTitle>
              <hr className="border-2 border-gray-200 dark:border-gray-800" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="conditions.day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day</FormLabel>
                      <FormDescription>
                        Day conditions (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Night</FormLabel>
                      <FormDescription>
                        Night conditions (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Actual Instrument</FormLabel>
                      <FormDescription>
                        Actual instrument conditions (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Simulated Instrument</FormLabel>
                      <FormDescription>
                        Simulated instrument conditions (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Cross Country</FormLabel>
                      <FormDescription>
                        Cross country time (optional)
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Landings, Approaches, Holds */}
              <CardTitle className="text-lg">
                Landings, Approaches, Holds
              </CardTitle>
              <hr className="border-2 border-gray-200 dark:border-gray-800" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="landings.day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Landings (Day)</FormLabel>
                      <FormDescription>
                        Number of day landings (optional)
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} />
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
                      <FormLabel>Landings (Night)</FormLabel>
                      <FormDescription>
                        Number of night landings (optional)
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} />
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
                      <FormLabel>Approaches</FormLabel>
                      <FormDescription>
                        Number of instrument approaches (optional)
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} />
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
                      <FormLabel>Holds</FormLabel>
                      <FormDescription>
                        Number of holds (optional)
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Remarks & Details */}
              <CardTitle className="text-lg">Remarks & Details</CardTitle>
              <hr className="border-2 border-gray-200 dark:border-gray-800" />
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormDescription>
                      Additional notes or comments (optional)
                    </FormDescription>
                    <FormControl>
                      <Textarea rows={3} {...field} />
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
                    <FormLabel>Instructor</FormLabel>
                    <FormDescription>
                      Name of instructor (optional)
                    </FormDescription>
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
                    <FormLabel>Flight Type</FormLabel>
                    <FormDescription>
                      Type of flight (training, solo, etc)
                    </FormDescription>
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
            <CardFooter className="flex justify-end space-x-4">
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
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
