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

// Esquema de validación con Zod
const ChallengeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  progress: z.number().min(0).max(100, "Progress must be between 0 and 100"),
  criteria: z.string().min(1, "Criteria is required"),
  metric: z.string().min(1, "Metric is required"),
  completed: z.boolean(),
});

type Challenge = z.infer<typeof ChallengeSchema>;

type Props = {
  onClose: () => void;
  onCreate: (newChallenge: Challenge) => void;
};

export default function CreateChallengeDialog({ onClose, onCreate }: Props) {
  const form = useForm<Challenge>({
    resolver: zodResolver(ChallengeSchema),
    defaultValues: {
      name: "",
      description: "",
      progress: 0,
      criteria: "",
      metric: "",
      completed: false,
    },
  });

  const handleSubmit = async (values: Challenge) => {
    try {
      // Generar un ID único para el usuario
      const user_id = uuidv4();

      // Realizar la solicitud al endpoint /challenge
      const response = await axios.post("http://localhost:3001/challenge", {
        user_id, // ID generado automáticamente
        name: values.name,
        description: values.description,
        progress: values.progress,
        criteria: values.criteria,
        metric: values.metric,
        completed: values.completed,
      });

      if (response.status === 200) {
        console.log("Challenge created successfully:", response.data);
        onCreate(response.data); // Agregar el desafío a la lista
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
                    <Input
                      type="number"
                      placeholder="Progress (e.g., 0, 50, 100)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criteria</FormLabel>
                  <FormControl>
                    <Input placeholder="Criteria" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metric"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric</FormLabel>
                  <FormControl>
                    <Input placeholder="Metric (e.g., time, tasks)" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completed</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={field.value ? "true" : "false"}
                      onChange={(e) =>
                        field.onChange(e.target.value === "true")
                      }
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
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