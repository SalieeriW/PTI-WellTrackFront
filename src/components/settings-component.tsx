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

function SettingsComponent() {
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      automaticMonitoring: false,
      cameraAccess: false,
      alertFrequency: "immediate", // Changed to a single value to match Select component behavior
      alertDuration: undefined,
      pauseAlerts: "Pause", // Default to a single value
      dataRetention: "30", // Default to a single value
      lighttheme: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    try {
      const response = await axiosInstance.post("/update_user_settings_handler", {
        defaultValues: data,
      });
  
      if (response.status === 200) {
        console.log("Settings updated successfully:", response.data);
      } else {
        console.error("Failed to update settings:", response.data);
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
      } else {
        console.error("Error updating settings:", error.message);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Automatic Monitoring Switch */}
          <FormField
            control={form.control}
            name="automaticMonitoring"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Automatic Monitoring</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Enable or disable automatic monitoring for the system.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Camera Access Switch */}
          <FormField
            control={form.control}
            name="cameraAccess"
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
            name="alertFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alert Frequency</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange} // Update value directly
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="5">Every 5 minutes</SelectItem>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Choose how frequently you'd like to receive alerts.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alert Duration Input */}
          <FormField
            control={form.control}
            name="alertDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alert Duration</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Set the duration for the alert in seconds.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pause Alerts Select */}
          <FormField
            control={form.control}
            name="pauseAlerts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pause Alerts</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange} // Update value directly
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pause">Pause</SelectItem>
                      <SelectItem value="Continue">Continue</SelectItem>
                    </SelectContent>
                  </Select>
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
            name="dataRetention"
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
          {/* Dark Mode Switch */}
          <FormField
            control={form.control}
            name="lighttheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dark Mode</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Enable or disable dark mode for the system.
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
