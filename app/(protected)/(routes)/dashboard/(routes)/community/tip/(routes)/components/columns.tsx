"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Tip } from "@/actions/dashboard/community/tip";
import CellAction from "./cell-action";

export const tipColumns: ColumnDef<Tip>[] = [
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
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div
        className="font-semibold text-center max-w-[200px] truncate"
        title={row.original.title}
      >
        {row.original.title}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => (
      <div
        className="text-center max-w-[300px] truncate"
        title={row.original.content}
      >
        {row.original.content}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "authorName",
    header: "Author",
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.original.authorName}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "authorDesignation",
    header: "Designation",
    cell: ({ row }) => (
      <div className="text-center text-sm text-muted-foreground">
        {row.original.authorDesignation}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline">{row.original.grade}</Badge>
      </div>
    ),
    enableSorting: false,
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
      const tip = row.original;

      return <CellAction tip={tip} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
