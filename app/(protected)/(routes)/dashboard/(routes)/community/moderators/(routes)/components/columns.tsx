"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Moderator } from "@/actions/dashboard/community/moderator";
import CellAction from "./cell-action";

export const moderatorColumns: ColumnDef<Moderator>[] = [
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
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "banStatus",
    header: "Ban Status",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.banStatus ? "Banned" : "Not Banned"}
      </div>
    ),
  },
  {
    accessorKey: "actionsCount",
    header: "Actions Count",
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.original.actionsCount}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "assignedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned At" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {dateFormat(new Date(row.original.assignedAt), "dd MMM yyyy")}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const moderator = row.original;

      return <CellAction moderator={moderator} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
