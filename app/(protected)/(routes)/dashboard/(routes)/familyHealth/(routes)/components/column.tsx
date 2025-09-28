"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { dateFormat } from "@/lib/format";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import CellAction from "./cell-action";
import { FamilyHealthCourse } from "@/types/familyHealth.types";

export const familyHealthColumns: ColumnDef<FamilyHealthCourse>[] = [
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
      <div className="flex items-start gap-3">
        {row.original.thumbnailUrl ? (
          <Image
            width={40}
            height={40}
            src={row.original.thumbnailUrl}
            alt={row.original.title}
            className="w-10 h-10 rounded-md object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-muted text-center flex items-center justify-center text-sm font-semibold">
            {row.original.title.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="font-medium max-w-[200px] truncate">
            {row.original.title}
          </div>
        </div>
      </div>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="h-full min-h-[64px] flex flex-col items-center justify-center text-sm text-muted-foreground text-center leading-snug">
        <div>{row.original.description?.slice(0, 30)}</div>
        <div>
          {row.original.description?.length > 60
            ? `${row.original.description.slice(30, 60)}...`
            : row.original.description?.slice(30, 60)}
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
        {row.original.isActive ? (
          <Badge variant="outline" className="text-green-700 border-green-600">
            <CheckCircle className="w-4 h-4 mr-1" /> Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-700 border-red-600">
            <XCircle className="w-4 h-4 mr-1" /> Inactive
          </Badge>
        )}
      </div>
    ),
    enableSorting: true,
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction story={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
