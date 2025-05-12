"use client";
import { v4 as uuidv4 } from "uuid";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SmartTaskSchema, { SmartTask } from "@/schema/smart-task.schema";
import ChallengeSchema, { Challenge } from "@/schema/challenge-schema";

type Props = {
  onClose: () => void;
  onCreate: (newSmartTask: Challenge) => void;
};

export default function CreateSmartTaskDialog({ onClose, onCreate }: Props) {
  const form = useForm<z.infer<typeof ChallengeSchema>>({
    resolver: zodResolver(ChallengeSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      date: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof ChallengeSchema>) => {
    // Log validation errors if any
    if (form.formState.errors) {
      console.log("Form validation errors:", form.formState.errors);
    }

    // If there are no validation errors, submit the form
    if (Object.keys(form.formState.errors).length === 0) {
      console.log("SmartTask created:", values);
      onCreate(values); // Pass the new SmartTask to the onCreate callback
      form.reset(); // Reset the form
    } else {
      console.log("Form contains errors. Not submitting.");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Create SmartTask</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form
          onSubmit={form.handleSubmit(handleSubmit)} // Ensure this correctly submits
          className="space-y-4 pt-4"
        >
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenge Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Challenge Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Challenge Description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="progress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Progress (0-100)"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="criterion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criterion</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Duration in seconds"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fingers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fingers</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Fingers to activate"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metricTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Metric (e.g., time, tasks)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-2 gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </Form>
        </form>
      </DialogContent>
    </Dialog>
  );
}
