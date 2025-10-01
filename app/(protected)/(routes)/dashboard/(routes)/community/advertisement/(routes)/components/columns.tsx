"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Advertisement } from "@/actions/dashboard/community/advertisement";
import CellAction from "./cell-action";

export const advertisementColumns: ColumnDef<Advertisement>[] = [
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
    accessorKey: "mediaUrl",
    header: "Media",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.mediaUrl ? (
          <div
            className="text-center max-w-[200px] truncate"
            title={row.original.mediaUrl}
          >
            {row.original.mediaUrl || "No Media"}
          </div>
        ) : (
          <span className="text-muted-foreground">No media</span>
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "redirectUrl",
    header: "Redirect URL",
    cell: ({ row }) => (
      <div
        className="text-center max-w-[200px] truncate"
        title={row.original.redirectUrl}
      >
        {row.original.redirectUrl || "No URL"}
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
      const advertisement = row.original;

      return <CellAction advertisement={advertisement} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
