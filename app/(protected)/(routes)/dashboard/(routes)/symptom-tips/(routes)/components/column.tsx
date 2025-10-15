"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
// Removed Image import as we don't use images for tips
import { dateFormat } from "@/lib/format";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
// FIX: Changed import from named to DEFAULT import (removed curly braces)
import CellAction from "./cell-action"; 
import { SymptomReliefTip } from "@/types/symptom-relief-tip.type";

// FIX: Rename exported array
export const symptomTipColumns: ColumnDef<SymptomReliefTip>[] = [
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

  // FIX: Column for Symptom Name (replaces 'title')
  {
    accessorKey: "symptomName",
    header: "Symptom Name",
    cell: ({ row }) => (
      <div className="flex items-start gap-3">
        {/* Simple initial letter avatar for Symptom Name */}
        <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-800 text-center flex items-center justify-center text-sm font-semibold shrink-0">
          {row.original.symptomName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium max-w-[200px] truncate">
            {row.original.symptomName}
          </div>
        </div>
      </div>
    ),
    enableSorting: true,
  },

  // FIX: Column for Tip Content (replaces 'description')
  {
    accessorKey: "tip",
    header: "Tip Content",
    cell: ({ row }) => (
      <div className="h-full min-h-[64px] flex flex-col items-start justify-center text-sm text-muted-foreground leading-snug">
        <div className="max-w-[300px] truncate">
          {/* Display first part of the tip */}
          {row.original.tip?.slice(0, 80)}
          {row.original.tip?.length > 80 && "..."}
        </div>
      </div>
    ),
    enableSorting: true,
  },

  // Status column remains the same
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

  // Created At column remains the same
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

  // Actions column (use 'tip' instead of 'story' prop name)
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction tip={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];