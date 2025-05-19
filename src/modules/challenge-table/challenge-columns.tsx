"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/schema/challenge-schema";

export const columns: ColumnDef<Challenge>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "download",
    header: "",
    cell: ({ row }) => {
      const { downloadUrl, name } = row.original;
      if (!downloadUrl) {
        return null; // No download URL available
      }
      return (
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </a>
      );
    },
  },
];
