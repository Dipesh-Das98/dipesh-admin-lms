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

interface LanguageCornerDataTableProps<TData, TValue> {
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
  currentLanguage?: string;
}

export function LanguageCornerDataTable<TData, TValue>({
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
  currentLanguage = "",
}: LanguageCornerDataTableProps<TData, TValue>) {
  const router = useRouter();

  const handleAddLanguageCorner = () => {
    router.push("/dashboard/language/add");
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
      currentLanguage={currentLanguage}
      categoryType="language_corner"
      actions={
        <Button onClick={handleAddLanguageCorner} className="flex items-center gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      }
    />
  );
}
