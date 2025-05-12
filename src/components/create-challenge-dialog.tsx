/*"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import ChallengeSchema, { Challenge } from "@/schema/challenge-schema";

type Props = {
  onClose: () => void;
  onCreate: (newChallenge: Challenge) => void;
};

export default function CreateChallengeDialog({ onClose, onCreate }: Props) {
  const form = useForm<z.infer<typeof ChallengeSchema>>({
    resolver: zodResolver(ChallengeSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      progress: "Not started",
      criterion: "",
      metricTypes: "",
      date: "",
      downloadUrl: "",
      duration: 0,
    },
  });

  const handleSubmit = (values: z.infer<typeof ChallengeSchema>) => {
    console.log("Challenge created:", values);
    values.id = uuidv4(); // Use uuidv4() to generate a unique ID for the new challenge
    onCreate(values);
    form.reset();
  };

  const handleSubmit = async (values: z.infer<typeof ChallengeSchema>) => {
    try {
      // Generar un ID único para el desafío
      values.id = uuidv4();

      // Realizar la solicitud al endpoint /challenge
      const response = await axios.post("http://localhost:3001/challenge", {
        ...values,
      });

      if (response.status === 200) {
        console.log("Challenge created successfully:", response.data);
        onCreate(values); // Agregar el desafío a la lista
        form.reset();
        onClose(); // Cerrar el diálogo
      } else {
        console.error("Failed to create challenge:", response.data);
        alert("Failed to create challenge. Please try again.");
      }
    } catch (error: any) {
      if (error.response) {
        // Error del servidor
        console.error("Server error:", error.response.data);
        alert(
          `Error: ${error.response.data.message || "Failed to create challenge."}`
        );
      } else if (error.request) {
        // Error de red
        console.error("Network error:", error.request);
        alert("Network error. Please check your connection.");
      } else {
        // Otro tipo de error
        console.error("Error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Create Challenge</DialogTitle>
      </DialogHeader>

      <DialogContent>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Progress" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not started">Not Started</SelectItem>
                        <SelectItem value="In progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Input placeholder="Criterion" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metricTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric Types</FormLabel>
                  <FormControl>
                    <Input placeholder="metric1, metric2, ..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        // Ensure we handle the value as a number
                        field.onChange(Number(e.target.value));
                      }}
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
}*/

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
                    <Input placeholder="e.g., time, focus" {...field} />
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
