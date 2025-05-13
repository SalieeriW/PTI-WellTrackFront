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
import axios from "axios";
import { useSession } from "next-auth/react";
import ChallengeSchema, { Challenge } from "@/schema/challenge-schema";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  onClose: () => void;
  onCreate: (newChallenge: Challenge) => void;
};

export default function CreateChallengeDialog({ onClose, onCreate }: Props) {
  const session = useSession();

  const form = useForm<Challenge>({
    resolver: zodResolver(ChallengeSchema),
    defaultValues: {
      name: "",
      description: "",
      progress: 0,
      criterion: 0,
      metricTypes: "",
    },
  });

  const handleSubmit = (values: Challenge) => {
    console.log("Challenge created:", values);
    onCreate(values);
    form.reset();
  };

  const [metrics, setMetrics] = useState<string[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/metrics");
        if (response.status === 200) {
          setMetrics(
            response.data.map((metric: { name: string }) => metric.name)
          );
        } else {
          console.error("Failed to fetch metrics:", response.data);
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Create Challenge</DialogTitle>
      </DialogHeader>

      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 pt-4"
          >
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
              name="metricTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a metric" />
                      </SelectTrigger>
                      <SelectContent>
                        {metrics.map((metric) => (
                          <SelectItem key={metric} value={metric}>
                            {metric}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
