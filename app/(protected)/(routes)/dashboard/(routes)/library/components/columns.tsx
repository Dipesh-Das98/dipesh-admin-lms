"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Library } from "@/types";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import {  CheckCircle, XCircle } from "lucide-react";
import { Checkbox } from "@radix-ui/react-checkbox";

export const libraryColumns: ColumnDef<Library>[] = [
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
    header:"Title",
    cell: ({ row }) => (
      <div className="flex items-start justify-start">
        <div className="flex items-center gap-3">
          {/* Library thumbnail or color preview */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium shadow-sm"
            style={{ backgroundColor: row.original.backgroundColor }}
          >
            {row.original.thumbnail ? (
              <Image
                width={40}
                height={40}
                src={row.original.thumbnail}
                alt={row.original.title}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <span className="text-white drop-shadow-sm">
                {row.original.title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-foreground max-w-[250px] truncate">
              {row.original.title}
            </div>
            {row.original.description && (
              <div className="text-sm text-muted-foreground max-w-[250px] truncate mt-1">
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
    accessorKey: "language",
    header:"Language",
    cell: ({ row }) => {
      const language = row.getValue("language") as string;
      return (
        <div className="flex items-center justify-center">
          <Badge variant="outline">
            {language}
          </Badge>
        </div>
      );
    },
    enableSorting: true,
    size: 120,
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
    header:"Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      if (!date) return <span className="text-muted-foreground">—</span>;
      
      return (
        <div className="text-sm text-center text-muted-foreground">
          {format(new Date(date), "MMM dd, yyyy")}
        </div>
      );
    },
    enableSorting: true,
    size: 120,
  },
  
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => 
      <div className="flex items-center justify-center">
        <CellAction library={row.original} />
      </div>,
    size: 80,
  },
];
