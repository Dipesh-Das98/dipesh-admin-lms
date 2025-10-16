// components/hospital-data-table-wrapper.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";
import { getAllHospitals } from "@/actions/dashboard/hospital/getAllHospitals"; 
import { hospitalColumns } from "./column"; 
import { ServerSideDataTable } from "./help-topic-data-table";

// FIX 4: Rename the component
const HospitalDataTableWrapper = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || ITEMS_PER_PAGE;
  const perPage = Number(searchParams.get("perPage")) || ITEMS_PER_PAGE;
  const sortBy = searchParams.get("sortBy") || "";
  const search = searchParams.get("search") || "";
  const sortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

  // FIX 5: Update the query key to reflect Hospitals
  const { data, isLoading, error } = useQuery({
    queryKey: ["hospitals", page, limit, search, sortOrder],
    // FIX 6: Use the correct API action for fetching all hospitals
    queryFn: () =>
      getAllHospitals({ page, limit, search, sortOrder }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    // FIX 7: Adjust column count to match the new hospital columns (7 columns)
    return <DataTableSkeleton columnCount={7} />; 
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">
            Error Loading Hospitals
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
    // FIX 8: Use the renamed DataTable component
    <ServerSideDataTable 
      columns={hospitalColumns}
      // FIX 9: Update data access path (assuming backend returns { data: { hospitals: [], meta: {} } })
      data={data?.data?.hospitals || []} 
      meta={{
        total: data?.data?.meta.total || 0,
        page: data?.data?.meta.page || 1,
        limit: data?.data?.meta.limit || perPage,
        hasNext:
          (data?.data?.meta.page || 1) <
          Math.ceil(
            (data?.data?.meta.total || 0) /
              (data?.data?.meta.limit || perPage)
          ),
      }}
      // FIX 10: Use the appropriate search key for hospitals
      searchKey="name" 
      currentPage={page}
      currentPerPage={perPage}
      currentSearch={search}
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
};

export default HospitalDataTableWrapper;