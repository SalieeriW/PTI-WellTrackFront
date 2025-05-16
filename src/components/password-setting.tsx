"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";

// Schema for validation
const formSchema = z.object({
  current: z.string().min(1, "Current password is required"),
  new: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(64, "Too long"),
});

export default function PasswordSettingsComponent() {
  const session = useSession();
  const userId = session.data?.user?.id;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current: "",
      new: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axiosInstance.post(
        `https://api.welltrack.local/api/auth/change_password/${userId}`,
        {
          old_password: values.current,
          new_password: values.new,
        }
      );
      alert("Password changed successfully");
    } catch (error: any) {
      if (error.response) {
        alert(`Error: ${error.response.data.error || "Something went wrong"}`);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row justify-between gap-6"
      >
        <div className="space-y-4 flex-1">
          <FormField
            control={form.control}
            name="current"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-2">
            Save password
          </Button>
        </div>

        <div className="flex justify-center items-center">
          <KeyRound size={128} className="text-gray-500" />
        </div>
      </form>
    </Form>
  );
}
