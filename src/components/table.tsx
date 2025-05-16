"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import axios from "axios";

export function ChallengeTable() {
  const session = useSession();
  const [challenges, setChallenges] = useState<any[]>([]); // Estado para almacenar los desafíos
  const [loading, setLoading] = useState<boolean>(true); // Estado para manejar la carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Valores predeterminados en caso de error
  const defaultChallenges = [
    {
      name: "Default Challenge 1",
      description: "No data available",
      progress: "Not started",
      criteria: "0",
      metric: "N/A",
    },
    {
      name: "Default Challenge 2",
      description: "No data available",
      progress: "Not started",
      criteria: "0",
      metric: "N/A",
    },
  ];

  useEffect(() => {
    const id = session.data?.user?.id;

    const fetchChallenges = async () => {
      try {
        const response = await axios.get(
          `https://api.welltrack.local/api/challenges/${id}`
        );

        const challenges = response.data.map((item: any) => ({
          name: item.name,
          description: item.description,
          progress: item.progress,
          criteria: item.meta,
          metric: item.metric,
        }));

        setChallenges(challenges); // Actualizar el estado con los desafíos
      } catch (err: any) {
        console.error("Error fetching challenges:", err.message || err);
        setError("An unexpected error occurred");
        setChallenges(defaultChallenges); // Usar valores predeterminados
      } finally {
        setLoading(false); // Finalizar el estado de carga
      }
    };
    fetchChallenges();
  }, []);
  /*
  if (loading) {
    return <div>Loading challenges...</div>;
  }

  if (error) {
    console.warn("Using default challenges due to error:", error);
  }*/

  return (
    <div className="w-full bg-white rounded-md shadow-md p-6 space-y-4">
      <div className="text-md font-semibold text-gray-500">Challenges</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Objective</TableHead>
            <TableHead>Metric</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {challenges.map((challenge, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{challenge.name}</TableCell>
              <TableCell>{challenge.description}</TableCell>
              <TableCell>{challenge.progress}</TableCell>
              <TableCell>{challenge.criteria}</TableCell>
              <TableCell>{challenge.metric}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              Total Challenges: {challenges.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
