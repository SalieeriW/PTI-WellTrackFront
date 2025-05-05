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


// Esquema de validación con zod
const formSchema = z.object({
  current: z.string().min(1, "Current password is required"),
  new: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(64, "Too long"),
});

export default function PasswordSettingsComponent() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current: "",
      new: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Password submitted:", values);const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        const response = await axiosInstance.post("/change_password", {
          user_id: 1, // ID del usuario
          current_password: values.current,
          new_password: values.new,
        });
  
        if (response.status === 200) {
          console.log("Password changed successfully:", response.data);
          alert("Password updated successfully!");
        } else {
          console.error("Failed to change password:", response.data);
          alert("Failed to update password. Please try again.");
        }
      } catch (error: any) {
        if (error.response) {
          console.error("Error response from server:", error.response.data);
          alert(`Error: ${error.response.data.message || "Something went wrong"}`);
        } else {
          console.error("Error changing password:", error.message);
          alert("An unexpected error occurred. Please try again.");
        }
      }
    };
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
