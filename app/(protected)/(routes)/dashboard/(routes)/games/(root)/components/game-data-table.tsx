"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServerPaginationDataTable } from "@/components/ui/data-table/server-pagination-data-table";
import { useSheet } from "@/hooks/use-sheet";

interface ServerPaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

interface GameDataTableProps<TData, TValue> {
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

export function GameDataTable<TData, TValue>({
  columns,
  data,
  meta,
  searchKey,
  currentPage,
  currentPerPage,
  currentSearch,
  currentSortBy = "",
  currentSortOrder = "desc",
}: GameDataTableProps<TData, TValue>) {
  const { openSheet } = useSheet();

  const handleAddGame = () => {
    openSheet("game-form", {
      mode: "create",
    });
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
        <Button onClick={handleAddGame} className="flex items-center gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Add Game
        </Button>
      }
    />
  );
}
