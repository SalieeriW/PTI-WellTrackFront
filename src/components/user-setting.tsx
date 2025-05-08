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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useSession } from "next-auth/react";

// Extend the Session type to include the id property
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export default function UserSettingsComponent() {
  const { data: session } = useSession(); // Obtener la sesión del usuario
  console.log(session);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
     console.log(values);
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:3001/delete_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email, // Obtener el email del usuario desde la sesión
          id: session?.user?.id, // Obtener el ID del usuario desde la sesión
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Account deleted successfully:", data);
        alert("Account deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete account:", errorData);
        alert(`Failed to delete account: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An unexpected error occurred. Please try again.");
    }
    
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row w-full gap-6"
      >
        {/* Avatar section */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="rounded-full w-24 h-24" />
          <Button variant="outline" size="sm">
            Change Avatar
          </Button>
        </div>

        {/* Form section */}
        <div className="flex flex-col flex-1 justify-between gap-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row justify-between pt-4">
          <Button
              variant="destructive"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
