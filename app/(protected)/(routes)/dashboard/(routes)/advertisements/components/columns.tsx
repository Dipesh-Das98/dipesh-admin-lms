"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";

import { Ads } from "@/types/ads.type";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import CellAction from "./cell-action";

export const paymentColumns: ColumnDef<Ads>[] = [
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
];

export const adsColumns: ColumnDef<Ads>[] = [
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
    cell: ({ row }) => row.original.title,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description,
  },
  {
    accessorKey: "imageUrl",
    header: "Banner Image",
    cell: ({ row }) =>
      row.original.imageUrl ? (
        <Image
          src={row.original.imageUrl}
          alt={row.original.title}
          width={64}
          height={40}
          className="h-10 w-16 object-cover rounded"
        />
      ):
      (<div className="flex items-center justify-center">
        <span className="text-xs text-gray-500">No Image</span>
        </div>)
      ,
    enableSorting: false,
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => (
      <a
        href={row.original.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-external-link"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span className="truncate max-w-[150px]">
          {new URL(row.original.link).hostname}
        </span>
      </a>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => dateFormat(row.original.startDate, "MMM dd, yyyy HH:mm"),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => dateFormat(row.original.endDate, "MMM dd, yyyy HH:mm"),
  },
  {
    accessorKey: "isActive",
    header: "Active Status",
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
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => dateFormat(row.original.createdAt, "MMM dd, yyyy"),
    enableHiding: true,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => dateFormat(row.original.updatedAt, "MMM dd, yyyy"),
    enableHiding: true,
  },
  {
    accessorKey:"action",
    header: "Actions",
    cell: ({ row }) => <CellAction ads={row.original} />,
    enableHiding: true,
  }
];
