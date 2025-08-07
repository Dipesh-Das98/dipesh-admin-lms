"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/pagination-data-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PaymentDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function AdvertisementsDataTable<TData, TValue>({
  columns,
  data,
}: PaymentDataTableProps<TData, TValue>) {
  const router=useRouter()
  const handleAddAdvertisement = () => {
    router.push("/dashboard/advertisements/create");
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey={"title"}
      actions={[
        <Button key={"add-advertisement"} onClick={handleAddAdvertisement}  size="sm">
          <span className="flex items-center gap-2">
            <span className="text-sm">Add Advertisement</span>
          </span>
        </Button>,
      ]}
    />
  );
}
