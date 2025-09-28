"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Parent } from "@/types";
import CellAction from "./cell-action";

export const parentColumns: ColumnDef<Parent>[] = [
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
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="font-semibold text-center">{row.original.username}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-center">{row.original.email}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary">{row.original.role}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {dateFormat(new Date(row.original.createdAt), "dd MMM yyyy")}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const parent = row.original;

      return <CellAction parent={parent} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
