"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServerPaginationDataTable } from "@/components/ui/data-table/server-pagination-data-table";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";

interface ServerPaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

interface PaymentDataTableProps<TData, TValue> {
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

export function PaymentDataTable<TData, TValue>({
  columns,
  data,
  meta,
  searchKey,
  currentPage,
  currentPerPage,
  currentSearch,
  currentSortBy = "",
  currentSortOrder = "desc",
}: PaymentDataTableProps<TData, TValue>) {
  const { openModal } = useModal();

  const handleAddPayment = () => {
    openModal("parent-id-model", {
      handleConfirm: () => {
        toast.success("Parent ID submitted successfully!");
      },
      confirmText: "Submit Parent ID",
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
        <Button onClick={handleAddPayment} className="flex items-center gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Add Payment
        </Button>
      }
    />
  );
}
