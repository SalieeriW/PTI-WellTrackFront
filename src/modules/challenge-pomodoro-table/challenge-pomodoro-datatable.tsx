"use client";

import { DataTable } from "@/components/Datatable";
import React, { useState } from "react";
import EditChallengeDialog from "@/components/edit-challenge-dialog";
import { getColumns } from "./challenge-pomodoro-columns";
import { Challenge } from "@/schema/challenge-schema";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function ChallengePomodoroDataTable({
  challenges,
  setChallenges,
}: {
  challenges: Challenge[];
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
}) {
  const session = useSession();
  const user_id = session.data?.user?.id;

  const [selected, setSelected] = useState<Challenge | null>(null);

  const handleDelete = (id: string) => {
    setChallenges((prev) => prev.filter((challenge) => challenge.id !== id));
    console.log("Challenge deleted:", id);

    axios
      .delete(`http://api.welltrack.local/api/challenges/${user_id}/${id}`)
      .then(() => {
        console.log("Challenge deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting challenge:", error);
      });
  };

  const columns = getColumns(handleDelete);
  return (
    <>
      <DataTable
        columns={columns}
        data={challenges}
        onRowClick={(row) => setSelected(row.original)}
      />
    </>
  );
}
