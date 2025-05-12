import { ColumnDef } from "@tanstack/react-table";
import { Delete, SquareX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/schema/challenge-schema";

// Update columns to include new fields
export const getColumns = (
  onDelete: (name: string) => void
): ColumnDef<Challenge>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "progress",
    header: "Progress",
  },
  {
    accessorKey: "criterion",
    header: "Criterion",
  },
  {
    accessorKey: "metricTypes",
    header: "Metric Types",
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id!);
          }}
        >
          <SquareX className="text-red-500" />
        </Button>
      );
    },
  },
];
