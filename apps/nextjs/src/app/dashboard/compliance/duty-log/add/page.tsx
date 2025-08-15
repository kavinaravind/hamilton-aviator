"use client";

import { useRouter } from "next/navigation";
import { calculateDuration } from "@/lib/compliance/duty-log";
import { useTRPC } from "@/lib/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";

import type { DutyLogCreate } from "@hamilton/validators/lib/compliance";
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
import { DutyLogCreateSchema } from "@hamilton/validators/lib/compliance";

export default function AddDutyEntryPage() {
  const trpc = useTRPC();

  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<DutyLogCreate>({
    resolver: zodResolver(DutyLogCreateSchema),
    defaultValues: {
      type: undefined,
      description: "",
      startTime: "",
      endTime: null,
      duration: null,
      status: "completed",
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
        router.push("/dashboard/compliance/duty-log");
      },
      onError: (err: any) => {
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
          className="mx-auto w-full max-w-2xl space-y-8"
          onSubmit={form.handleSubmit((data) => {
            createDutyEntry.mutate(data);
          })}
        >
          {/* Section: Duty Type */}
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Duty Type
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 rounded-b-xl pt-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
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
            </CardContent>
          </Card>

          {/* Section: Basic Information */}
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Basic Information
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 rounded-b-xl pt-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
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
            </CardContent>
          </Card>

          {/* Section: Time Information */}
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Time Information
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 rounded-b-xl pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
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
            </CardContent>
          </Card>

          {/* Section: Additional Information */}
          <Card className="rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Additional Information
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 rounded-b-xl pt-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
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
              disabled={createDutyEntry.isPending}
              size="sm"
              className="px-3"
            >
              {createDutyEntry.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
