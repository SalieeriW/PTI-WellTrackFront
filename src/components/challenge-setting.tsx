"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { challengeSettingSchema } from "@/schema/setting-schema";
import axios from "axios";
import { useSession } from "next-auth/react";

import { Check, Goal } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function ChallengeSettings() {
  const session = useSession();

  const form = useForm<z.infer<typeof challengeSettingSchema>>({
    resolver: zodResolver(challengeSettingSchema),
    defaultValues: {
      allow_deepanalisis: false, // <-- updated name (if needed)
      auto_email: false,
      alert_frecuency: "daily",
    },
  });

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const id = session.data?.user?.id;
      if (!id) return;

      try {
        const response = await axios.get(
          `http://api.welltrack.local/api/challenges/settings/${id}`
        );

        console.log("Response from settings API:", response);
        const parsedData = {
          allow_deepanalisis: response.data.allow_deepanalisis,
          auto_email: response.data.auto_email,
          alert_frecuency: response.data.alert_frecuency,
        };

        console.log("Fetched settings:", parsedData);
        form.reset(parsedData);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    if (session.status === "authenticated") {
      fetchSettings();
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof challengeSettingSchema>) => {
    const id = session.data?.user?.id;
    if (!id) return;

    console.log("Form data to be sent:", data);

    try {
      await axios.post(
        `http://api.welltrack.local/api/challenges/settings/${id}`,
        data
      );
      alert("Settings saved successfully."); // or use toast
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Challenge Settings</CardTitle>
        <CardDescription>
          Configure how alerts and reports are generated and delivered.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="auto_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auto Email</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Automatically send email notifications when alerts are
                      triggered.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allow_deepanalisis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deep Analysis</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Enable or disable deep analysis of the data.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alert_frecuency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alert Frequency</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">
                            <Check className="mr-2" />
                            Daily
                          </SelectItem>
                          <SelectItem value="weekly">
                            <Check className="mr-2" />
                            Weekly
                          </SelectItem>
                          <SelectItem value="monthly">
                            <Check className="mr-2" />
                            Monthly
                          </SelectItem>
                          <SelectItem value="trimesterly">
                            <Check className="mr-2" />
                            Trimesterly
                          </SelectItem>
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

              <CardFooter className="flex justify-end p-0 pt-4">
                <Button type="submit">Save</Button>
              </CardFooter>
            </form>
          </Form>
          <Goal size={300} strokeWidth={0.5} className="hidden sm:flex" />
        </div>
      </CardContent>
    </Card>
  );
}

export default ChallengeSettings;
