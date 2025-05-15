"use client";
import ChallengeCreation from "@/components/challenge-creation";
import PomodoroTimer from "@/components/pomodoro";
import { Challenge } from "@/schema/challenge-schema";
import { SmartTask } from "@/schema/smart-task.schema";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

// const dummySmartTasks: SmartTask[] = [
//   {
//     id: "1",
//     name: "Focus Sprint",
//     description: "25 minutes of deep work",
//     date: "2025-04-01",
//   },
//   {
//     id: "2",
//     name: "Writing Burst",
//     description: "15 minutes of writing",
//     date: "2025-04-05",
//   },
//   {
//     id: "3",
//     name: "Debug Mode",
//     description: "20 minutes of debugging",
//     date: "2025-04-10",
//   },
// ];

function Pomodoro() {
  const session = useSession();
  const id = session.data?.user?.id;
  const [challenges, setChallenges] = React.useState<Challenge[]>([]); // Estado para almacenar los desafíos

  const [challengesPomodoro, setChallengesPomodoro] = React.useState<
    Challenge[]
  >([]); // Estado para almacenar los desafíos
  const [smartTasks, setSmartTasks] = React.useState<Challenge[]>([]); // Estado para almacenar las tareas inteligentes

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(
          `http://api.welltrack.local/api/challenges/${id}`
        );

        const rawChallenges = response.data;

        const parsedChallenges: (Challenge & { isST?: boolean } & {
          isCompleted: boolean;
        })[] = rawChallenges.map((item: any) => ({
          id: String(item.id),
          date: new Date(item.created_at).toISOString().split("T")[0],
          name: item.name || "Unnamed Challenge",
          description: item.description || "No description provided",
          progress: Number(item.progress) || 0,
          criterion: String(item.meta ?? "No criterion specified"),
          metricTypes: String(item.metric ?? "N/A"),
          downloadUrl: item.pdf_url || undefined,
          isST: item.is_smarttask === true,
          isCompleted: item.completed === true,
        }));

        const filteredChallenges = parsedChallenges.filter(
          (item) => !item.isST && !item.isCompleted
        );

        const filteredChallengesPomodoro = parsedChallenges.filter(
          (item) =>
            !item.isST && !item.isCompleted && item.metricTypes == "time"
        );

        const filteredSmartTasks = parsedChallenges.filter(
          (item) => item.isST && !item.isCompleted
        );

        setChallenges(
          filteredChallenges.map(({ isST, isCompleted, ...rest }) => rest)
        );
        setSmartTasks(
          filteredSmartTasks.map(({ isST, isCompleted, ...rest }) => rest)
        );
        setChallengesPomodoro(
          filteredChallengesPomodoro.map(
            ({ isST, isCompleted, ...rest }) => rest
          )
        );
      } catch (err: any) {
        console.error("Error fetching challenges:", err.message || err);
        setChallenges([]);
        setSmartTasks([]);
      }
    };

    if (id) {
      fetchChallenges();
    }
  }, [id]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const response = await axios.get(
        `http://api.welltrack.local/api/challenges/${id}`
      );

      const rawChallenges = response.data;

      const parsedChallenges: (Challenge & { isST?: boolean } & {
        isCompleted: boolean;
      })[] = rawChallenges.map((item: any) => ({
        id: String(item.id),
        date: new Date(item.created_at).toISOString().split("T")[0],
        name: item.name || "Unnamed Challenge",
        description: item.description || "No description provided",
        progress: Number(item.progress) || 0,
        criterion: String(item.meta ?? "No criterion specified"),
        metricTypes: String(item.metric ?? "N/A"),
        downloadUrl: item.pdf_url || undefined,
        isST: item.is_smarttask === true,
        isCompleted: item.completed === true,
      }));

      const filteredChallengesPomodoro = parsedChallenges.filter(
        (item) => !item.isST && !item.isCompleted && item.metricTypes == "time"
      );
      setChallengesPomodoro(
        filteredChallengesPomodoro.map(({ isST, isCompleted, ...rest }) => rest)
      );
    };

    if (id) {
      fetchChallenges();
    }
  }, [challenges]);

  return (
    <div className="flex flex-col items-center h-full w-full gap-4">
      <PomodoroTimer challenges={challengesPomodoro} />
      <ChallengeCreation
        challenges={challenges}
        setChallenges={setChallenges}
        smartTasks={smartTasks}
        setSmartTasks={setSmartTasks}
      />
    </div>
  );
}

export default Pomodoro;
