"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Course } from "@/types/course.type";
import { CellAction } from "./cell-action"
import { dateFormat } from "@/lib/format";
import Image from "next/image";

export const courseColumns: ColumnDef<Course>[] = [
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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
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
          {/* Course thumbnail or color preview */}
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-medium"
            style={{
              backgroundColor: row.original.backgroundColor || "#6E56CF",
            }}
          >
            {row.original.thumbnail ? (
              <Image
                src={row.original.thumbnail}
                alt={row.original.title}
                width={32}
                height={32}
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
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="text-xs">
          {row.original.grade}
        </Badge>
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
          {row.original.language ? row.original.language.toUpperCase() : "N/A"}
        </Badge>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="text-xs">
          {row.original.category?.name || "No Category"}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge
          variant={row.original.isPublished ? "default" : "secondary"}
          className="text-xs"
        >
          {row.original.isPublished ? "Published" : "Draft"}
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
      const course = row.original;
      return (
        <div className="flex items-center justify-center">
          <CellAction course={course} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
