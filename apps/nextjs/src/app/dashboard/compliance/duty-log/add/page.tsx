"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";

import { Button } from "@hamilton/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hamilton/ui/components/ui/card";
import { Input } from "@hamilton/ui/components/ui/input";
import { Label } from "@hamilton/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hamilton/ui/components/ui/select";
import { Textarea } from "@hamilton/ui/components/ui/textarea";

interface DutyFormData {
  date: string;
  dutyType: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
}

export default function AddDutyEntryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DutyFormData>({
    date: new Date().toISOString().split("T")[0] || "",
    dutyType: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof DutyFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateDuration = (start: string, end: string): string => {
    if (!start || !end) return "0.0";

    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    if (
      startHour === undefined ||
      startMin === undefined ||
      endHour === undefined ||
      endMin === undefined
    ) {
      return "0.0";
    }

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    let duration = endMinutes - startMinutes;
    if (duration < 0) duration += 24 * 60; // Handle overnight flights

    return (duration / 60).toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would call your API to save the duty entry
      console.log("Duty entry data:", {
        ...formData,
        duration: calculateDuration(formData.startTime, formData.endTime),
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/dashboard/compliance/duty-log");
    } catch (error) {
      console.error("Error saving duty entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const isFormValid =
    formData.date &&
    formData.dutyType &&
    formData.startTime &&
    formData.endTime &&
    formData.location &&
    formData.description;

  return (
    <div className="flex-1 p-4 pt-4 sm:p-8 sm:pt-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-2xl space-y-6"
      >
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Add Duty Entry
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Record a new duty time entry for compliance tracking
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>

            {/* Duty Type */}
            <div className="space-y-2">
              <Label htmlFor="dutyType">Duty Type</Label>
              <Select
                value={formData.dutyType}
                onValueChange={(value) => handleInputChange("dutyType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duty type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight">Flight Duty</SelectItem>
                  <SelectItem value="ground">Ground Duty</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Duration (calculated) */}
            {formData.startTime && formData.endTime && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">
                  Duration:{" "}
                  {calculateDuration(formData.startTime, formData.endTime)}{" "}
                  hours
                </p>
              </div>
            )}

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., KLAX, Training Center, Home Office"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the duty activities..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row sm:space-x-3">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full sm:flex-1"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Duty Entry"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
