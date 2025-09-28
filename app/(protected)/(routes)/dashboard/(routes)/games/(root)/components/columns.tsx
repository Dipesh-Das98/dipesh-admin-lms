"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Game } from "@/types";
import { CellAction } from "./cell-action";
import { dateFormat } from "@/lib/format";
import Image from "next/image";

export const gameColumns: ColumnDef<Game>[] = [
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
      <div className="flex items-start justify-start">
        <div className="flex items-center gap-3">
          {/* Game thumbnail or color preview */}
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-medium"
            style={{
              backgroundColor: row.original.backgroundColor || "#6E56CF",
            }}
          >
            {row.original.thumbnail ? (
              <Image
                width={32}
                height={32}
                src={row.original.thumbnail}
                alt={row.original.title}
                className="w-8 h-8 rounded-md object-cover"
              />
            ) : (
              <span className="text-black">
                {row.original.title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium max-w-[200px] truncate">
              {row.original.title}
            </div>
            {row.original.description && (
              <div className="text-xs text-muted-foreground max-w-[200px] truncate">
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
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="secondary" className="text-xs">
          {row.original.language}
        </Badge>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "timePerLevel",
    header: "Time per Level",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="text-xs">
          {row.original.timePerLevel
            ? `${row.original.timePerLevel} seconds`
            : "N/A"}
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
            style={{
              backgroundColor: row.original.backgroundColor || "#6E56CF",
            }}
          />
          <span className="text-xs text-muted-foreground">
            {row.original.backgroundColor || "Default"}
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
      const game = row.original;
      return (
        <div className="flex items-center justify-center">
          <CellAction game={game} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
