"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { LanguageCorner } from "@/types";
import CellAction from "./cell-action";
import { dateFormat } from "@/lib/format";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";


export const languageCornerColumns: ColumnDef<LanguageCorner>[] = [
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
      <div className="flex items-center gap-3 max-w-[300px]">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {row.original.thumbnail ? (
            <Image
              src={row.original.thumbnail}
              alt={row.original.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {row.original.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="font-medium text-sm truncate">{row.original.title}</div>
          <div className="text-xs text-muted-foreground truncate">
            {row.original.description}
          </div>
        </div>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="secondary" className="text-xs">
          {row.original.category?.name || "No Category"}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "isActive",
    header: "Status",
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
    header: "Order",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="text-xs">
          {row.original.order || 0}
        </Badge>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "backgroundColor",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-border"
            style={{ backgroundColor: row.original.backgroundColor }}
          />
          <span className="text-xs text-muted-foreground">
            {row.original.backgroundColor}
          </span>
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
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
      const languageCorner = row.original;
      return (
        <div className="flex items-center justify-center">
          <CellAction languageCorner={languageCorner} />
        </div>
      );
    },
    enableSorting: false,
  },
];
