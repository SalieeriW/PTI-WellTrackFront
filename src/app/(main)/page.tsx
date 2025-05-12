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

const dayLetterMap = ["D", "L", "M", "X", "J", "V", "S"]; // Sunday = 0
const weekdayOrder = ["L", "M", "X", "J", "V", "S", "D"]; // usado para ordenar

export default function Dashboard() {
  // const hydrationAttempts = useHydrationAttempts();
  // const fatiguescore = useLevelTiredness();

  const session = useSession();
  const metrics = [
    {
      title: "Drinking Times",
      icon: <GlassWater />,
      description: "",
    },
    {
      title: "Fatigue Times",
      icon: <BatteryLow />,
      description: "",
    },
    {
      title: "Bad Posture Times",
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
  const [barChartData, setBarChartData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const id = session.data?.user?.id;
        if (!id) return;

        const response = await axios.get(
          `http://localhost:3001/api/dashboard/${id}`
        );

        console.log("Response from dashboard API:", response);

        const data = response.data;

        setMetricsValues({
          water: data.is_drinking,
          fatigue: data.is_tired,
          posture: data.is_badpos,
          rest: data.rest,
        });

        const transformedData = data.weeklyDrinking.map(
          (entry: { day: string; value: number }) => {
            const date = new Date(entry.day);
            const dayIndex = date.getDay(); // 0 (Sun) to 6 (Sat)
            const dayLetter = dayLetterMap[dayIndex];
            return { day: dayLetter, value: entry.value };
          }
        );

        const sorted = transformedData.sort(
          (a: { day: string }, b: { day: string }) =>
            weekdayOrder.indexOf(a.day) - weekdayOrder.indexOf(b.day)
        );

        setBarChartData(sorted);

        setChartData(data.challengesProgress);
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        setMetricsValues({
          water: 0,
          fatigue: 0,
          posture: 0,
          rest: 0,
        });
        setBarChartData([]);
        setChartData([]);
      }
    };

    fetchDashboardMetrics();
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
          <PieChartComponent chartData={chartData} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 w-full h-full mt-4">
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
