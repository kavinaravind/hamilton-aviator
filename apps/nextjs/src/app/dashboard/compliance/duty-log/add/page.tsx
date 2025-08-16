"use client";

import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

import type { DutyLogCreate } from "@hamilton/validators/lib/compliance";
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
  calculateDuration,
  DutyLogCreateSchema,
} from "@hamilton/validators/lib/compliance";

export default function AddDutyEntryPage() {
  const trpc = useTRPC();

  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<DutyLogCreate, DutyLogCreate>({
    schema: DutyLogCreateSchema,
    defaultValues: {
      type: undefined,
      description: "",
      startTime: "",
      endTime: null,
      duration: null,
      status: undefined,
      location: "",
      crew: "",
      aircraft: "",
      flightNumber: "",
      instructor: "",
      trainingType: undefined,
      notes: "",
    },
  });

  const createDutyEntry = useMutation(
    trpc.dutyLog.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.dutyLog.pathFilter());
        toast.success("Duty entry added successfully");
        router.push("/dashboard/compliance/duty-log");
      },
      onError: (err: any) => {
        console.error("ERROR", err);
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to add a duty entry"
            : "Failed to add duty entry",
        );
      },
    }),
  );

  return (
    <div className="flex-1 bg-white p-4 pt-4 dark:bg-gray-950 sm:p-8 sm:pt-6">
      <Form {...form}>
        <form
          className="mx-auto w-full max-w-2xl"
          onSubmit={form.handleSubmit((data) => createDutyEntry.mutate(data))}
        >
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Duty Log Entry</CardTitle>
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
              <CardDescription>Enter all duty details below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Duty Type */}
              <CardTitle className="text-lg">Duty Type</CardTitle>
              <hr className="border-2 border-gray-200 dark:border-gray-800" />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duty type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flight-duty">
                            Flight Duty
                          </SelectItem>
                          <SelectItem value="standby">Standby</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Basic Information */}
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <hr className="border-2 border-gray-200 dark:border-gray-800" />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter duty description"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Information */}
              <CardTitle className="text-lg">Time Information</CardTitle>
              <hr className="border-2 border-gray-200 dark:border-gray-800" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.watch("startTime") && form.watch("endTime") && (
                <div className="rounded-lg bg-muted p-3 dark:bg-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Duration:{" "}
                    {calculateDuration(
                      form.watch("startTime"),
                      form.watch("endTime") || "",
                    )}{" "}
                    hours
                  </p>
                </div>
              )}

              {/* Additional Information */}
              <CardTitle className="text-lg">Additional Information</CardTitle>
              <hr className="border-2 border-gray-200 dark:border-gray-800" />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Location (optional)"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="crew"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crew</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Crew (optional)"
                        {...field}
                        value={field.value ?? ""}
                      />
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
                    <FormControl>
                      <Input
                        placeholder="Aircraft (optional)"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flightNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Flight Number (optional)"
                        {...field}
                        value={field.value ?? ""}
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
                    <FormLabel>Instructor</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Instructor (optional)"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trainingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select training type (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simulator">Simulator</SelectItem>
                          <SelectItem value="checkride">Checkride</SelectItem>
                          <SelectItem value="recurrent">Recurrent</SelectItem>
                          <SelectItem value="initial">Initial</SelectItem>
                          <SelectItem value="ground-school">
                            Ground School
                          </SelectItem>
                          <SelectItem value="flight-review">
                            Flight Review
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes or comments"
                        rows={3}
                        {...field}
                        value={field.value ?? ""}
                      />
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
                disabled={createDutyEntry.isPending}
                size="sm"
                className="px-3"
              >
                {createDutyEntry.isPending ? "Saving..." : "Save"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
