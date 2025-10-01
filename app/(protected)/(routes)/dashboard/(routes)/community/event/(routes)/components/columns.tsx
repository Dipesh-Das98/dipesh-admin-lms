"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Event } from "@/actions/dashboard/community/event";
import CellAction from "./cell-action";

export const eventColumns: ColumnDef<Event>[] = [
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
    accessorKey: "eventName",
    header: "Event Name",
    cell: ({ row }) => (
      <div className="font-semibold text-center">{row.original.eventName}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "eventDateTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event Date & Time" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {dateFormat(new Date(row.original.eventDateTime), "dd MMM yyyy HH:mm")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "targetType",
    header: "Target Type",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge
          variant={row.original.targetType === "ALL" ? "default" : "secondary"}
        >
          {row.original.targetType}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "parentId",
    header: "Parent ID",
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.original.parentId.slice(0, 8)}...
      </div>
    ),
    enableSorting: false,
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
      const event = row.original;

      return <CellAction event={event} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
