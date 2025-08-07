"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { AdvertisementsDataTable } from "./advertisements-data-table";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";
import { adsColumns } from "./columns";
import { getAds } from "@/actions/dashboard/ads/get-ads";

const DataTableWrapper = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ads"],
    queryFn: () => getAds(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">
            Error Loading Payments
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdvertisementsDataTable
      columns={adsColumns}
      data={data?.data || []}
    />
  );
};

export default DataTableWrapper;
