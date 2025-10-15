// components/tables/pregnancy-week-content-table/columns.tsx

"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { dateFormat } from "@/lib/format";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
// FIX: Rename component import (assuming you will update the component name)
import PregnancyWeekContentCellAction from "./cell-action"; 
// FIX: Correct Type for Pregnancy Week Content
import { PregnancyWeekContent } from "@/types/pregnancy.type";

// FIX: Correct Array Name for Pregnancy Week Content
export const pregnancyWeekContentColumns: ColumnDef<PregnancyWeekContent>[] = [
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

  // 1. Column for Week and Trimester
  {
    accessorKey: "week",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Week & Trimester" />
    ),
    cell: ({ row }) => (
      <div className="flex items-start gap-2">
        {/* Simple initial letter avatar for Week Number */}
        <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-800 text-center flex items-center justify-center text-sm font-semibold shrink-0">
          Wk {row.original.week}
        </div>
        <div>
          <div className="font-medium max-w-[200px] truncate">
            {/* Show Week number */}
            Week {row.original.week}
          </div>
          {/* Show Trimester as subtitle */}
          <div className="text-xs text-muted-foreground">
            Trimester {row.original.trimester}
          </div>
        </div>
      </div>
    ),
    // Use week for sorting, as it's the primary accessorKey
    enableSorting: true, 
  },

  // 2. Column for Fetal Size and Comparison
  {
    accessorKey: "fetalSizeCm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fetal Size (cm)" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.original.fetalSizeCm} cm
        <div className="text-xs text-muted-foreground max-w-[200px] truncate">
            {row.original.sizeComparison}
        </div>
      </div>
    ),
    enableSorting: true,
  },

  // 3. Column for Heartbeat Status (replaces Recommended Status)
  {
    accessorKey: "hasHeartbeat",
    header: "Heartbeat",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.hasHeartbeat ? (
          <Badge variant="outline" className="text-pink-700 border-pink-600">
            <CheckCircle className="w-4 h-4 mr-1" /> Yes
          </Badge>
        ) : (
          <Badge variant="outline" className="text-stone-700 border-stone-600">
            <XCircle className="w-4 h-4 mr-1" /> No
          </Badge>
        )}
      </div>
    ),
    enableSorting: true,
  },
  
  // 4. Created At column remains the same
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

  // 5. Actions column 
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {/* Using the corrected CellAction component */}
        {/* FIX: Change prop name from 'tip' to 'content' */}
        <PregnancyWeekContentCellAction content={row.original} /> 
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];