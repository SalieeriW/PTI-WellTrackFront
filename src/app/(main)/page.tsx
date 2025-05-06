"use client";

import {
  GlassWater,
  BatteryLow,
  PersonStanding,
  MonitorPause,
} from "lucide-react";
import MetricCard from "@/components/metric-card";
import BarChartComponent from "@/components/barchart";
import PieChartComponent from "@/components/piechart";
import Calendar from "@/components/custom-calendar";
import { ChallengeTable } from "@/components/table";
import { useHydrationAttempts } from "@/hooks/use-hydrationattempts";
import { useLevelTiredness } from "@/hooks/use-leveltiredness";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

// Extend the Session type to include the id property
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Valores que apareceran en la tabla de agua consumida:
const barChartData = [
  { day: "L", value: 2 },
  { day: "M", value: 9 },
  { day: "X", value: 5 },
  { day: "J", value: 7 },
  { day: "V", value: 8 },
  { day: "S", value: 8 },
  { day: "D", value: 8 },
];

// valor de la tabla de progreso, como es dinamico se añade automaticamente
const progressData = [
  { id: "Deep Focus Sprint", a: 3, b: 1, c: 5, d: 2, e: 8 },
  { id: "Pomodoro Mastery", a: 3, b: 1, c: 5, d: 2, e: 9 },
  { id: "Hydration Hero", a: 4, b: 2, c: 6, d: 2, e: 0 },
];

// valor de la grafica de tiempo
const timeData = [
  { name: "Tarea A", value: 55, color: "#8884d8" },
  { name: "Tarea B", value: 20, color: "#82ca9d" },
  { name: "Tarea C", value: 55, color: "#ffc658" },
  { name: "Tarea D", value: 20, color: "#ff8042" },
];

export type MetricValues = {
  water: number;
  fatigue: number;
  posture: number;
  rest: number;
};

export default function Dashboard() {
  // const hydrationAttempts = useHydrationAttempts();
  // const fatiguescore = useLevelTiredness();

  const session = useSession();
  console.log(session);
  console.log(session.data?.user?.id); // Using 'email' as the identifier
  const metrics = [
    {
      title: "H2O Consumption Tracker",
      icon: <GlassWater />,
      description: "",
    },
    {
      title: "Fatigue Score",
      icon: <BatteryLow />,
      description: "",
    },
    {
      title: "Posture Health Index",
      icon: <PersonStanding />,
      description: "",
    },
    {
      title: "Rest Pause Count",
      icon: <MonitorPause />,
      description: "",
    },
  ];

  const [metricsValues, setMetricsValues] = useState<MetricValues>({
    water: 0,
    fatigue: 0,
    posture: 0,
    rest: 0,
  });

  useEffect(() => {
    const fetchHydrationAttempts = async () => {
      try {
        console.log("Fetching hydration attempts...");
        const response = await axios.post("http://localhost:3001/show_data", {
          user_id: session.data?.user?.id,
        });

        setMetricsValues({
          water: response.data.hydration,
          fatigue: response.data.nivel_of_stress,
          posture: response.data.posture_correction,
          rest: response.data.breaks,
        });
      } catch (error) {
        setMetricsValues({
          water: 0,
          fatigue: 0,
          posture: 0,
          rest: 0,
        });
      }
    };

    fetchHydrationAttempts();
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-gray-200">
      <div className="flex flex-col flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              icon={metric.icon}
              value={
                index === 0
                  ? metricsValues.water
                  : index === 1
                  ? metricsValues.fatigue
                  : index === 2
                  ? metricsValues.posture
                  : metricsValues.rest
              }
              description={metric.description}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
          <BarChartComponent
            data={barChartData}
            title="Weekly Water Consumption"
          />
          <PieChartComponent />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 w-full mt-4">
          <div className="lg:col-span-7 h-full">
            <ChallengeTable />
          </div>
          <div className="lg:col-span-3 h-full">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
