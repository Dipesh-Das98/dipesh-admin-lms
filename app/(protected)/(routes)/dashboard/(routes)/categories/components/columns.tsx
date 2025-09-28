"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Category } from "@/types/category.type";
import CellAction from "./cell-action";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";

export const categoryColumns: ColumnDef<Category>[] = [
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
      <div className="flex items-start justify-start">
        <div className="flex items-center gap-3">
          {/* Category thumbnail or color preview */}
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: row.original.backgroundColor || "#6366f1" }}
          >
            {row.original.thumbnail ? (
              <Image
                width={32}
                height={32}
                src={row.original.thumbnail}
                alt={row.original.name}
                className="w-8 h-8 rounded-md object-cover"
              />
            ) : (
              <span className="text-white font-semibold">
                {row.original?.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium max-w-[200px] truncate">
              {row.original?.name}
            </div>
            {row.original.description && (
              <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                {row.original.description}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="capitalize">
          {row.original.type.replace("_", " ")}
        </Badge>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "isActive",
    header:"Status",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          {row.original.isActive ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Active</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-600 font-medium">Inactive</span>
            </>
          )}
        </div>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="text-xs font-mono">
          {row.original.order || 0}
        </Badge>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.grade ? (
          <Badge variant="secondary" className="text-xs">
            {row.original.grade}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">N/A</span>
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "backgroundColor",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-border"
            style={{ backgroundColor: row.original.backgroundColor || "#6366f1" }}
          />
          <span className="text-xs text-muted-foreground font-mono">
            {row.original.backgroundColor || "#6366f1"}
          </span>
        </div>
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
      <div className="flex items-center justify-center">
        <div className="text-sm">
          {row.original.createdAt
            ? dateFormat(new Date(row.original.createdAt), "dd MMM yyyy")
            : "N/A"}
        </div>
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center justify-center">
          <CellAction category={category} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
