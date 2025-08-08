"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";

import { Button } from "@hamilton/ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@hamilton/ui/components/ui/card";
import { Input } from "@hamilton/ui/components/ui/input";
import { Label } from "@hamilton/ui/components/ui/label";
import { Textarea } from "@hamilton/ui/components/ui/textarea";

// Define the form data type for a logbook entry
interface LogbookFormData {
  date: string;
  aircraft: string;
  departure: string;
  arrival: string;
  route: string;
  totalTime: string;
  picTime: string;
  sicTime: string;
  instrumentTime: string;
  nightTime: string;
  crossCountryTime: string;
  approaches: string;
  landingsDay: string;
  landingsNight: string;
  remarks: string;
  flightType: string;
  conditions: string;
}

export default function AddLogbookEntryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LogbookFormData>({
    date: new Date().toISOString().split("T")[0] || "",
    aircraft: "",
    departure: "",
    arrival: "",
    route: "",
    totalTime: "",
    picTime: "",
    sicTime: "",
    instrumentTime: "",
    nightTime: "",
    crossCountryTime: "",
    approaches: "",
    landingsDay: "",
    landingsNight: "",
    remarks: "",
    flightType: "pic",
    conditions: "day",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof LogbookFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Here you would call your API to save the logbook entry
      console.log("Logbook entry data:", formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/logbook");
    } catch (error) {
      console.error("Error saving logbook entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Add Flight Log Entry</h2>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Aircraft</Label>
                <Input
                  value={formData.aircraft}
                  onChange={(e) =>
                    handleInputChange("aircraft", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Departure</Label>
                <Input
                  value={formData.departure}
                  onChange={(e) =>
                    handleInputChange("departure", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Arrival</Label>
                <Input
                  value={formData.arrival}
                  onChange={(e) => handleInputChange("arrival", e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label>Route</Label>
                <Input
                  value={formData.route}
                  onChange={(e) => handleInputChange("route", e.target.value)}
                />
              </div>
              <div>
                <Label>Total Time</Label>
                <Input
                  value={formData.totalTime}
                  onChange={(e) =>
                    handleInputChange("totalTime", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>PIC Time</Label>
                <Input
                  value={formData.picTime}
                  onChange={(e) => handleInputChange("picTime", e.target.value)}
                />
              </div>
              <div>
                <Label>SIC Time</Label>
                <Input
                  value={formData.sicTime}
                  onChange={(e) => handleInputChange("sicTime", e.target.value)}
                />
              </div>
              <div>
                <Label>Instrument Time</Label>
                <Input
                  value={formData.instrumentTime}
                  onChange={(e) =>
                    handleInputChange("instrumentTime", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Night Time</Label>
                <Input
                  value={formData.nightTime}
                  onChange={(e) =>
                    handleInputChange("nightTime", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Cross Country Time</Label>
                <Input
                  value={formData.crossCountryTime}
                  onChange={(e) =>
                    handleInputChange("crossCountryTime", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Approaches</Label>
                <Input
                  value={formData.approaches}
                  onChange={(e) =>
                    handleInputChange("approaches", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Landings (Day)</Label>
                <Input
                  value={formData.landingsDay}
                  onChange={(e) =>
                    handleInputChange("landingsDay", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Landings (Night)</Label>
                <Input
                  value={formData.landingsNight}
                  onChange={(e) =>
                    handleInputChange("landingsNight", e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <Label>Remarks</Label>
              <Textarea
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Flight Type</Label>
                <Input
                  value={formData.flightType}
                  onChange={(e) =>
                    handleInputChange("flightType", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Conditions</Label>
                <Input
                  value={formData.conditions}
                  onChange={(e) =>
                    handleInputChange("conditions", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
