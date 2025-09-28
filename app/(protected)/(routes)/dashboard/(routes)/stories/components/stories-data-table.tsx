"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServerPaginationDataTable } from "@/components/ui/data-table/server-pagination-data-table";

interface ServerPaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

interface StoriesDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: ServerPaginationMeta;
  searchKey?: string;
  currentPage: number;
  currentPerPage: number;
  currentSearch: string;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
}

export function StoriesDataTable<TData, TValue>({
  columns,
  data,
  meta,
  searchKey,
  currentPage,
  currentPerPage,
  currentSearch,
  currentSortBy = "",
  currentSortOrder = "desc",
}: StoriesDataTableProps<TData, TValue>) {
  const router = useRouter();

  const handleAddStory = () => {
    router.push("/dashboard/stories/add");
  };

  return (
    <ServerPaginationDataTable
      columns={columns}
      data={data}
      meta={meta}
      searchKey={searchKey}
      currentPage={currentPage}
      currentPerPage={currentPerPage}
      currentSearch={currentSearch}
      currentSortBy={currentSortBy}
      currentSortOrder={currentSortOrder}
      actions={
        <Button onClick={handleAddStory} className="flex items-center gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Add Story
        </Button>
      }
    />
  );
}
