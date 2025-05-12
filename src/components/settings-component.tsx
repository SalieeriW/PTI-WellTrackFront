import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { settingsSchema } from "@/schema/setting-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "./ui/switch";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function SettingsComponent() {
  const session = useSession();
  const id = session.data?.user?.id;
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      camera_access: false,
      scan_freq: "15", // Changed to a single value to match Select component behavior
      enable_alert: false, // Default to a single value
      data_retention: "30", // Default to a single value
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:3001/api/generalSettings/${id}`
        );

        console.log("Fetched settings:", response.data);

        const settings = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        if (settings) {
          form.reset({
            camera_access: settings.camera_access ?? false,
            scan_freq: settings.scan_freq ?? 15,
            enable_alert: settings.enable_alerts ?? false,
            data_retention: settings.data_retention ?? "30",
          });
        }
      } catch (error: any) {
        console.error("Error fetching settings:", error.message);
      }
    };

    if (id) {
      fetchSettings();
    }
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    try {
      const response = await axiosInstance.post(
        `http://localhost:3001/api/generalSettings/${id}`,
        data
      );
      console.log("Settings updated:", response.data);

      alert("Settings updated successfully");
    } catch (error: any) {
      if (error.response) {
        console.error("Error response from server:", error.response.data.error);
      } else {
        console.error("Error updating settings:", error.message);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Camera Access Switch */}
          <FormField
            control={form.control}
            name="camera_access"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Camera Access</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Enable or disable camera access for the system.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alert Frequency Select */}
          <FormField
            control={form.control}
            name="scan_freq"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scan Frequency</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Enter frequency in minutes"
                  />
                </FormControl>
                <FormDescription>
                  Choose how frequently you'd like to process your image in
                  seconds.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pause Alerts Select */}
          <FormField
            control={form.control}
            name="enable_alert"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enable Alerts</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Choose whether to pause or continue alerts.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Data Retention Select */}
          <FormField
            control={form.control}
            name="data_retention"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Retention</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange} // Update value directly
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Retention" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Choose how long the system should retain data.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SettingsComponent;
