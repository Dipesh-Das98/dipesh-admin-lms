"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { dateFormat } from "@/lib/format";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import CellAction from "./cell-action";
import { HelpTopic } from "@/types/help-topic.type";

export const helpTopicColumns: ColumnDef<HelpTopic>[] = [
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
    accessorKey: "topicName",
    header: "Topic Name",
    cell: ({ row }) => (
      <div className="font-medium max-w-[200px] truncate text-center">
        {row.original.topicName}
      </div>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "questions",
    header: "Questions",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        {row.original.questions && row.original.questions.length > 0 ? (
          row.original.questions.slice(0, 2).map((q, idx) => (
            <div key={idx} className="truncate">
              • {q}
            </div>
          ))
        ) : (
          <span className="text-gray-400">No questions</span>
        )}
        {row.original.questions.length > 2 && (
          <span className="text-xs text-blue-600">
            +{row.original.questions.length - 2} more
          </span>
        )}
      </div>
    ),
    enableSorting: false,
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
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-center">
        {row.original.updatedAt
          ? dateFormat(new Date(row.original.updatedAt), "dd MMM yyyy")
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
        <CellAction helpTopic={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
