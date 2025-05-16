"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Activity, Timer } from "lucide-react";
import { Challenge } from "@/schema/challenge-schema";
import axios from "axios";
import { useSession } from "next-auth/react";

type Mode = "Challenge" | "Short Break" | "Long Break";

function PomodoroTimer({ challenges }: { challenges: Challenge[] }) {
  const session = useSession();
  const id = session.data?.user?.id;

  const [mode, setMode] = useState<Mode>("Challenge");
  const [isRunning, setIsRunning] = useState(false);
  const [currentChallenge, setChallenge] = useState<string>(""); // State to track if the timer is completed
  const [isCompleted, setIsCompleted] = useState(false); // State to track if the timer is completed
  const [time, setTime] = useState(
    challenges.find((challenge) => challenge.id === currentChallenge)
      ?.criterion || 0
  ); // 25 minutes in seconds
  const [isAlarmOn, setIsAlarmOn] = useState(false); // State to track if the alarm is on
  const [longBreakTime, setLongBreakTime] = useState(15 * 60); // State to track long break time
  const [shortBreakTime, setShortBreakTime] = useState(5 * 60); // State to track short break time

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const logPomodoroEvent = async (
    event: string,
    challengeId: string,
    progress: number
  ) => {
    try {
      if (event === "pomodoroGet") {
        const response = await axios.get(
          `https://api.welltrack.local/api/challenges/${id}/${challengeId}`
        );

        return response.data.progress;
      } else if (event === "pomodoroCompleted") {
        const response = await axios.patch(
          `https://api.welltrack.local/api/challenges/${id}/${challengeId}`,
          {
            progress: progress,
            completed: true,
          }
        );
      } else if (event === "pomodoroLog") {
        const response = await axios.patch(
          `https://api.welltrack.local/api/challenges/${id}/${challengeId}`,
          {
            progress: progress,
          }
        );
      } else if (event === "pomodoroRest") {
        const response = await axios.post(
          `https://api.welltrack.local/api/activity/${id}`,
          {
            activity: "rest",
          }
        );
      }
    } catch (err) {
      console.error("Failed to log Pomodoro event:", err);
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setTime(
      newMode === "Challenge"
        ? challenges.find((challenge) => challenge.id === currentChallenge)
            ?.criterion || 0
        : newMode === "Short Break"
        ? shortBreakTime
        : longBreakTime
    );
    setIsRunning(false); // Stop the timer when mode changes
    setIsCompleted(false); // Reset the completion state
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer!); // Stop timer when it hits 0
            setIsRunning(false); // Stop the timer
            setIsCompleted(true); // Mark the timer as completed
            return 0; // Prevent going negative
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isRunning && timer) {
      clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, time]);

  useEffect(() => {
    // Only show the toast when the timer completes for the first time
    if (isCompleted) {
      toast("Task completed!");
      if (isAlarmOn) {
        const audio = new Audio(
          "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav"
        ); // Replace with a public URL to an alarm sound
        audio.play();
      }
      if (mode !== "Challenge") {
        logPomodoroEvent("pomodoroRest", currentChallenge, time);
      } else {
        logPomodoroEvent("pomodoroCompleted", currentChallenge, time);
      }
    }
  }, [isCompleted]); // This will run when isCompleted changes to true

  useEffect(() => {
    return () => {
      if (!isCompleted && currentChallenge) {
        logPomodoroEvent("pomodoroLog", currentChallenge, time);
      }
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pomodoro Timer</CardTitle>
        <CardDescription>Focus on your task!</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
          <div className="flex flex-col justify-center items-center mb-4 space-y-2">
            <div className="flex flex-row p-2 bg-gray-100 rounded-lg w-full justify-center">
              {["Challenge", "Short Break", "Long Break"].map((m) => (
                <button
                  key={m}
                  className={`px-4 py-2 mx-2 rounded ${
                    mode === m ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => handleModeChange(m as Mode)}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="text-center text-8xl">{formatTime(time)}</div>
            <div className="flex flex-col items-center justify-center">
              {isCompleted && (
                <div className="mt-4 text-center text-md text-gray-500">
                  Congratulations! You've completed your task.
                </div>
              )}
              {!isCompleted && (
                <Button
                  className={"px-4 py-2 mt-4 rounded"}
                  variant={`${isRunning ? "destructive" : "default"}`}
                  onClick={toggleTimer}
                >
                  {isRunning ? "Pause" : "Start"}
                </Button>
              )}
              {mode === "Challenge" && (
                <Select
                  value={currentChallenge || ""}
                  onValueChange={(value) => {
                    const selected = challenges.find(
                      (challenge) => challenge.id === value
                    );
                    if (selected) {
                      setChallenge(selected.id!);
                      setTime(selected.criterion - selected.progress);
                    }
                  }}
                >
                  <SelectTrigger className="w-full mt-4 bg-gray-100 rounded-lg p-2">
                    {challenges.find(
                      (challenge) => challenge.id === currentChallenge
                    )?.name || "Select a Challenge"}
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    {challenges.map((challenge) => (
                      <SelectItem key={challenge.id} value={challenge.id!}>
                        {challenge.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <div className="flex flex-col h-full w-full jusitfy-center items-center sm:justify-items-start sm:items-start space-y-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="short-break-time">
                Set short break time (seconds)
              </Label>
              <Input
                id="short-break-time"
                type="number"
                value={shortBreakTime}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    setShortBreakTime(value);
                    if (mode === "Short Break") {
                      setTime(value);
                      setIsRunning(false);
                      setIsCompleted(false);
                    }
                  }
                }}
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="long-break-time">
                Set long break time (seconds)
              </Label>
              <Input
                id="long-break-time"
                type="number"
                value={longBreakTime}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    setLongBreakTime(value);
                    if (mode === "Long Break") {
                      setTime(value);
                      setIsRunning(false);
                      setIsCompleted(false);
                    }
                  }
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="alarm-switch">Alarm</Label>
              <Switch
                id="alarm-switch"
                checked={isAlarmOn}
                onCheckedChange={(checked) => setIsAlarmOn(checked)}
              />
            </div>
          </div>
          <div className="flex items-start justify-center">
            <Timer size={200} className="text-gray-500" strokeWidth={0.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PomodoroTimer;
