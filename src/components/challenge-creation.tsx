"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

import CreateChallengeDialog from "./create-challenge-dialog";
import { Challenge } from "@/schema/challenge-schema";
import ChallengePomodoroDataTable from "@/modules/challenge-pomodoro-table/challenge-pomodoro-datatable";
import { SmartTask } from "@/schema/smart-task.schema";
import SmartTaskTable from "@/modules/smart-task-table/smart-task-datatable";
import CreateSmartTaskDialog from "./create-smart-task-dialog";
import axios from "axios";
import { useSession } from "next-auth/react";
import { set } from "date-fns";

function ChallengeCreation({
  challenges,
  smartTasks,
  setChallenges,
  setSmartTasks,
}: {
  challenges: Challenge[];
  smartTasks: Challenge[];
  setSmartTasks: React.Dispatch<React.SetStateAction<Challenge[]>>;
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
}) {
  const session = useSession();
  const id = session.data?.user?.id;

  const [openCreateChallengeDialog, setOpenCreateChallengeDialog] =
    useState(false);

  const addChallenge = (newChallenge: Challenge) => {
    setChallenges((prevChallenges) => [...prevChallenges, newChallenge]);

    axios
      .post(`https://api.welltrack.local/api/challenges/${id}`, {
        name: newChallenge.name,
        description: newChallenge.description,
        meta: newChallenge.criterion,
        metric: newChallenge.metricTypes,
        progress: newChallenge.progress,
        completed: false,
        is_smarttask: false,
      })
      .then((response) => {
        console.log("Challenge saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving challenge:", error);
      });
  };

  const handleCreateChallenge = (newChallenge: Challenge) => {
    console.log("Nuevo desafío creado:", newChallenge);
    setOpenCreateChallengeDialog(false);
    addChallenge(newChallenge); // Agregar el nuevo desafío a la lista
  };

  const [openCreateSmartTaskDialog, setOpenCreateSmartTaskDialog] =
    useState(false);

  const addSmartTask = (newSmartTask: Challenge) => {
    setSmartTasks((prevSmartTasks) => [...prevSmartTasks, newSmartTask]);
    axios
      .post(`https://api.welltrack.local/api/challenges/${id}`, {
        name: newSmartTask.name,
        description: newSmartTask.description,
        meta: newSmartTask.criterion,
        metric: newSmartTask.metricTypes,
        progress: newSmartTask.progress,
        fingers: newSmartTask.fingers,
        completed: false,
        is_smarttask: true,
      })
      .then((response) => {
        console.log("SmartTask saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving challenge:", error);
      });
  };

  const handleCreateSmartTask = (newSmartTask: Challenge) => {
    console.log("Nuevo smartTask creado:", newSmartTask);
    setOpenCreateSmartTaskDialog(false);
    addSmartTask(newSmartTask); // Agregar el nuevo desafío a la lista
  };

  return (
    <div className="grid grid-col-1 lg:grid-cols-2 gap-4 h-full w-full">
      <Card className="h-full">
        <div className="flex flex-row justify-between mr-4">
          <CardHeader className="w-full">
            <CardTitle>Challenges</CardTitle>
            <CardDescription>Manage your challenges here</CardDescription>
          </CardHeader>
          <Button onClick={() => setOpenCreateChallengeDialog(true)}>
            Create Challenge
          </Button>
          {openCreateChallengeDialog && (
            <CreateChallengeDialog
              onClose={() => setOpenCreateChallengeDialog(false)}
              onCreate={handleCreateChallenge}
            />
          )}
        </div>
        <CardContent className="h-full">
          <ChallengePomodoroDataTable
            challenges={challenges}
            setChallenges={setChallenges}
          />
        </CardContent>
      </Card>
      <Card className="h-full">
        <div className="flex flex-row justify-between mr-4">
          <CardHeader className="w-full">
            <CardTitle>Smart Tasks</CardTitle>
            <CardDescription>Manage your Smart Tasks here</CardDescription>
          </CardHeader>
          <Button onClick={() => setOpenCreateSmartTaskDialog(true)}>
            Create Smart Task
          </Button>
          {openCreateSmartTaskDialog && (
            <CreateSmartTaskDialog
              onClose={() => setOpenCreateSmartTaskDialog(false)}
              onCreate={handleCreateSmartTask}
            />
          )}
        </div>
        <CardContent className="h-full">
          <ChallengePomodoroDataTable
            challenges={smartTasks}
            setChallenges={setSmartTasks}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ChallengeCreation;
