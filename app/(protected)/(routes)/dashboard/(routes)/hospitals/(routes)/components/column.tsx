// components/columns.tsx (for Hospitals)
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { dateFormat } from "@/lib/format";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import CellAction from "./cell-action"; // CellAction component is assumed to be in the same directory
// FIX 1: Import the correct type for Hospital
import { HospitalRecord } from "@/types/hospital.type"; 
// FIX 2: Import the Badge component for better visualization (assuming it exists)
import { Badge } from "@/components/ui/badge"; 


// FIX 3: Change the column array name and type
export const hospitalColumns: ColumnDef<HospitalRecord>[] = [
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
    // FIX 4: Change accessorKey to Hospital's name field
    accessorKey: "name",
    header: "Hospital Name",
    cell: ({ row }) => (
      <div className="font-medium max-w-[200px] truncate">
        {row.original.name}
      </div>
    ),
    enableSorting: true,
  },
  
  {
    // FIX 5: Add a column for Address
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground max-w-[200px] truncate">
        {row.original.address}
      </div>
    ),
    enableSorting: true,
  },

  {
    // FIX 6: Add a column for Rating
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="text-sm font-semibold text-center w-full">
        {/* Display rating with an emoji for visual appeal */}
        {row.original.rating} ⭐
      </div>
    ),
    enableSorting: true,
  },

  {
    // FIX 7: Add a column for Active Status
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-sm text-center">
        {row.original.isActive ? (
          <Badge variant="default" className="bg-green-600 hover:bg-green-600/90">
            Active
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-500 hover:bg-red-500/90 text-white">
            Inactive
          </Badge>
        )}
      </div>
    ),
    enableSorting: true,
  },

  {
    // FIX 8: Keep createdAt
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

  // FIX 9: Remove the updatedAt column to save space, but leave the option to re-add.
  // We prioritize critical Hospital fields.

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {/* FIX 10: Pass the hospital record object to CellAction */}
        <CellAction hospital={row.original} /> 
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];