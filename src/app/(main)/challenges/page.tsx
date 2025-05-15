"use client";
import ChallengeSettings from "@/components/challenge-setting";
import React, { useEffect } from "react";
import Image from "next/image";
import { Goal } from "lucide-react";
import { DataTable } from "@/components/Datatable";

import ChallengeDataTable from "@/modules/challenge-table/challenge-datatable";
import { Challenge } from "@/schema/challenge-schema";
import { useSession } from "next-auth/react";
import axios from "axios";

function Challenges() {
  const session = useSession();
  const [challenges, setChallenges] = React.useState<Challenge[]>([]); // Estado para almacenar los desafíos

  useEffect(() => {
    const id = session.data?.user?.id;

    const fetchChallenges = async () => {
      try {
        const response = await axios.get(
          `http://api.welltrack.local/api/challenges/${id}`
        );

        const challenges = response.data.map((item: any) => ({
          id: item.id,
          date: new Date(item.created_at).toISOString().split("T")[0],
          name: item.name || "Unnamed Challenge",
          description: item.description || "No description provided",
          progress: item.progress || "Not started",
          criterion: item.meta || 0,
          metricTypes: item.metric || "N/A",
          downloadUrl: item.pdf_url || "#",
        }));

        console.log("Challenges fetched:", challenges);
        setChallenges(challenges); // Actualizar el estado con los desafíos
      } catch (err: any) {
        console.error("Error fetching challenges:", err.message || err);

        setChallenges([]); // Usar valores predeterminados
      }
    };
    fetchChallenges();
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-gray-200">
      <div className="flex flex-col flex-1 p-4 w-full">
        <div className="w-full">
          <ChallengeSettings />
        </div>
      </div>
      <div className="w-full mt-4">
        <ChallengeDataTable challenges={challenges} />
      </div>
    </div>
  );
}

export default Challenges;
