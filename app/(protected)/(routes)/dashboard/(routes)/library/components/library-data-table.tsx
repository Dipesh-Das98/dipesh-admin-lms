"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningServerPaginationDataTable } from "@/components/ui/data-table/learning-server-pagination-data-table";

interface ServerPaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

interface LibraryDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: ServerPaginationMeta;
  searchKey?: string;
  currentPage: number;
  currentPerPage: number;
  currentSearch: string;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  currentCategory?: string;
}

export function LibraryDataTable<TData, TValue>({
  columns,
  data,
  meta,
  searchKey,
  currentPage,
  currentPerPage,
  currentSearch,
  currentSortBy = "",
  currentSortOrder = "desc",
  currentCategory = "",
}: LibraryDataTableProps<TData, TValue>) {
  const router = useRouter();

  const handleAddLibrary = () => {
    router.push("/dashboard/library/add");
  };

  return (
    <LearningServerPaginationDataTable
      columns={columns}
      data={data}
      meta={meta}
      searchKey={searchKey}
      currentPage={currentPage}
      currentPerPage={currentPerPage}
      currentSearch={currentSearch}
      currentSortBy={currentSortBy}
      currentSortOrder={currentSortOrder}
      currentCategory={currentCategory}
      categoryType="library"
      actions={
        <Button onClick={handleAddLibrary} className="flex items-center gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Add Library
        </Button>
      }
    />
  );
}
