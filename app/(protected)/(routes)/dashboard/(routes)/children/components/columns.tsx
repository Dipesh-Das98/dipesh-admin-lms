"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { child } from "@/types";
import CellAction from "./cell-action";
import Image from "next/image";

export const childColumns: ColumnDef<child>[] = [
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
    accessorKey: "firstName",
    header: ({}) => (
      <div className="flex items-center justify-start">
        <span className="font-medium">Child Name</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {row.original.avatar ? (
              <Image
                width={32}
                height={32}
                src={row.original.avatar}
                alt={`${row.original.nickname}`}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-primary">
                {row.original.nickname.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium">
              {row.original.nickname} 
            </div>
            {row.original.nickname && (
              <div className="text-sm text-muted-foreground">
                &quot;{row.original.nickname}&quot;
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "gender",
    header: "gender",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="capitalize">
          {row.original.gender}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "grade",
    header: "grade",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="secondary">{row.original.grade}</Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "language",
    header: "language",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="capitalize">
          {row.original.language}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "parentRole",
    header: "parentRole",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="capitalize">
          {row.original.parentRole ? row.original.parentRole : "N/A"}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const child = row.original;
      return (
        <div className="flex items-center justify-center">
          <CellAction child={child} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
