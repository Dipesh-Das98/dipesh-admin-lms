"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { dateFormat } from "@/lib/format";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
// Import CellAction (assuming the Pregnancy Nutrition version is correct now)
import CellAction from "./cell-action";
// 1. Correct Type for Pregnancy Nutrition
import { PregnancyNutritionTip } from "@/types/pregnancy-nutrition.type";

// 2. Correct Array Name for Pregnancy Nutrition
export const pregnancyNutritionColumns: ColumnDef<PregnancyNutritionTip>[] = [
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

  // 3. Column for Food Name
  {
    accessorKey: "foodName",
    header: "Food Name",
    cell: ({ row }) => (
      <div className="flex items-start gap-3">
        {/* Simple initial letter avatar for Food Name */}
        <div className="w-10 h-10 rounded-md bg-green-100 text-green-800 text-center flex items-center justify-center text-sm font-semibold shrink-0">
          {row.original.foodName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium max-w-[200px] truncate">
            {row.original.foodName}
          </div>
          {/* Optional: Show Category as subtitle */}
          <div className="text-xs text-muted-foreground">
            {row.original.foodCategory}
          </div>
        </div>
      </div>
    ),
    enableSorting: true,
  },

  // 4. Column for Recommended Status (similar to isActive status)
  {
    accessorKey: "isRecommended",
    header: "Recommended",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.isRecommended ? (
          <Badge variant="outline" className="text-green-700 border-green-600">
            <CheckCircle className="w-4 h-4 mr-1" /> Yes
          </Badge>
        ) : (
          <Badge variant="outline" className="text-amber-700 border-amber-600">
            <XCircle className="w-4 h-4 mr-1" /> No
          </Badge>
        )}
      </div>
    ),
    enableSorting: true,
  },
  
  // 5. Column for Week Range (Calculated column)
  {
    id: "weekRange",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Week Range" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-center font-medium">
        Wk {row.original.weekStart} - Wk {row.original.weekEnd}
      </div>
    ),
    accessorFn: row => `${row.weekStart}-${row.weekEnd}`, // Accessor for sorting/filtering
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

  // Actions column 
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {/* Using the corrected CellAction component */}
        <CellAction tip={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];