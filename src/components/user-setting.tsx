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
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { LogOut } from "lucide-react";

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
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
});

export default function UserSettingsComponent() {
  const session = useSession();
  const userId = session.data?.user?.id;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://api.welltrack.local/api/auth/get_names/${userId}`
        );
        const { firstname, lastname } = response.data;

        form.reset({
          firstname: firstname || "",
          lastname: lastname || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user data. Please try again.");
      }
    };

    fetchUserData();
  }, [userId, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      axios.post(
        `http://api.welltrack.local/api/auth/change_name/${userId}`,
        values
      );
      alert("Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        `http://api.welltrack.local/api/auth/delete_account/${userId}`
      );
      alert("Account deleted successfully!");
      signOut();
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
              name="firstname"
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
              name="lastname"
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
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
