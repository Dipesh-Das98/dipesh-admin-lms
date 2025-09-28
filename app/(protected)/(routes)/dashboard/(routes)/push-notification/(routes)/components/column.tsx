"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { dateFormat } from "@/lib/format";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import CellAction from "./cell-action";
import { PushNotificationTemplate } from "@/types/push-notification.type";

export const pushNotificationColumn: ColumnDef<PushNotificationTemplate>[] = [
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

  // Title Column (used to be "topicName")
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-[200px] truncate">
        {row.original.title}
      </div>
    ),
    enableSorting: true,
  },

  // Message Column (used to be "questions")
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-sm text-muted-foreground">
        {row.original.message || <span className="text-gray-400">No message</span>}
      </div>
    ),
    enableSorting: false,
  },
  
  // Start Time Column
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-center">
        {row.original.startTime
          ? dateFormat(new Date(row.original.startTime), "dd MMM yyyy HH:mm")
          : "N/A"}
      </div>
    ),
    enableSorting: true,
  },

  // End Time Column
  {
    accessorKey: "endTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Time" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-center">
        {row.original.endTime
          ? dateFormat(new Date(row.original.endTime), "dd MMM yyyy HH:mm")
          : "N/A"}
      </div>
    ),
    enableSorting: true,
  },

  // Created At Column
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

  // Actions Column
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction pushNotificationTemplates={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];