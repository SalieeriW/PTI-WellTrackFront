import { MetricValues } from "@/app/(main)/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface CustomCardProps {
  title: string;
  icon: ReactNode;
  value: number;
  description: string;
}

export default function MetricCard({
  title,
  icon,
  value,
  description,
}: CustomCardProps) {
  return (
    <Card className="w-full h-full rounded-md ">
      <CardHeader className="flex flex-row justify-between pb-2">
        <CardTitle className="text-md font-semibold text-gray-500">
          {title}
        </CardTitle>
        <div className="h-6 w-6 text-gray-400">{icon} </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-md text-green-500">{description}</p>
      </CardContent>
    </Card>
  );
}
