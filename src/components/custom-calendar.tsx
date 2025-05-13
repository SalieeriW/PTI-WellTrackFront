"use client";
import React from "react";
import { Calendar as UICalendar } from "@/components/ui/calendar";

function Calendar() {
  const [date, setDate] = React.useState<Date | undefined>(() => new Date());

  return (
    <div className="w-full h-full bg-white rounded-md shadow-md p-6 flex-1">
      <div className="text-md font-semibold text-gray-500">Calendar</div>

      <UICalendar
        className="h-full w-full flex"
        selected={date}
        onSelect={setDate}
        classNames={{
          months:
            "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
          month: "space-y-4 w-full flex flex-col",
          table: "w-full h-full border-collapse space-y-1",
          head_row: "",
          row: "w-full mt-2",
        }}
      />
    </div>
  );
}

export default Calendar;
