"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseServerPaginationDataTable } from "@/components/ui/data-table/course-server-pagination-data-table";
import { useSheet } from "@/hooks/use-sheet";

interface ServerPaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

interface CourseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: ServerPaginationMeta;
  searchKey?: string;
  currentPage: number;
  currentPerPage: number;
  currentSearch: string;
  currentCategory?: string;
  currentLanguage?: string;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
}

export function CourseDataTable<TData, TValue>({
  columns,
  data,
  meta,
  searchKey,
  currentPage,
  currentPerPage,
  currentSearch,
  currentCategory = "",
  currentLanguage = "",
  currentSortBy = "",
  currentSortOrder = "desc",
}: CourseDataTableProps<TData, TValue>) {
  const { openSheet } = useSheet();

  const handleAddCourse = () => {
    openSheet("course-form", {
      mode: "create",
    });
  };

  return (
    <CourseServerPaginationDataTable
      columns={columns}
      data={data}
      meta={meta}
      searchKey={searchKey}
      currentPage={currentPage}
      currentPerPage={currentPerPage}
      currentSearch={currentSearch}
      currentCategory={currentCategory}
      currentLanguage={currentLanguage}
      currentSortBy={currentSortBy}
      currentSortOrder={currentSortOrder}
      actions={
        <Button onClick={handleAddCourse} className="flex items-center gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      }
    />
  );
}
