"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { PostCategory } from "@/actions/dashboard/community/post-category";
import CellAction from "./cell-action";
import Image from "next/image";

export const postCategoryColumns: ColumnDef<PostCategory>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-semibold text-center">{row.original.name}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "iconUrl",
    header: "Icon",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.iconUrl ? (
          <div className="w-12 h-12 mx-auto rounded overflow-hidden">
            <Image
              src={row.original.iconUrl}
              alt={row.original.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <span className="text-muted-foreground">No icon</span>
        )}
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
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {dateFormat(new Date(row.original.updatedAt), "dd MMM yyyy")}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const postCategory = row.original;

      return <CellAction postCategory={postCategory} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
