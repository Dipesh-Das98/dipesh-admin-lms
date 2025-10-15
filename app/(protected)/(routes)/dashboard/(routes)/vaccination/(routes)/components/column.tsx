// components/table/column.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { dateFormat } from "@/lib/format";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import CellAction from "./cell-action";
import { VaccinationResponseData } from "@/types/vaccination.type"; 

export const vaccinationColumns: ColumnDef<VaccinationResponseData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "vaccineName", // UPDATED ACCESSOR KEY
    header: "Vaccine Name", // UPDATED HEADER
    cell: ({ row }) => (
      <div className="font-medium max-w-[200px] truncate">
        {row.original.vaccineName}
      </div>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "weekNumber", 
    header: "Week", // Concise header for Week Number
    cell: ({ row }) => (
      <div className="font-semibold text-center text-primary">
        {row.original.weekNumber}
      </div>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="h-full min-h-[40px] flex items-center justify-start text-sm text-muted-foreground leading-snug">
        <div className="max-w-[250px] truncate">
          {row.original.description}
        </div>
      </div>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.isActive ? (
          <Badge variant="outline" className="text-green-700 border-green-600">
            <CheckCircle className="w-4 h-4 mr-1" /> Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-700 border-red-600">
            <XCircle className="w-4 h-4 mr-1" /> Inactive
          </Badge>
        )}
      </div>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-center">
        {row.original.createdAt
          ? dateFormat(new Date(row.original.createdAt), "dd MMM yyyy")
          : "N/A"}
      </div>
    ),
    enableSorting: true,
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction vaccination={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];