// components/tables/pregnancy-week-content-table/dataTable.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
// FIX 1: Import the correct columns
import { pregnancyWeekContentColumns } from "./column"; 
import { useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";

// FIX 2: Import the correct action for fetching data (which we created earlier)
// FIX 3: Rename the data table component (assuming you will update the name in table.tsx)
import { PregnancyWeekContentDataTable } from "./tableTips"; 
import { getAllPregnancyWeekContent } from "@/actions/dashboard/pregnancy/get-all-pregnancy";


// FIX 4: Rename the component
const PregnancyWeekContentDataTableWrapper = () => {
    const searchParams = useSearchParams();

    // Standard pagination/sorting parameters
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || ITEMS_PER_PAGE;
    const perPage = Number(searchParams.get("perPage")) || ITEMS_PER_PAGE;
    const sortBy = searchParams.get("sortBy") || "";
    const search = searchParams.get("search") || "";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
    
    const { data, isLoading, error } = useQuery({
        // FIX 6: Update queryKey to match new resource and new filter param
        queryKey: ["pregnancy-week-content", page, limit, search, sortOrder], 
        // FIX 7: Update queryFn to use the new action and parameters
        queryFn: () => getAllPregnancyWeekContent({ page, limit, search, sortOrder }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    if (isLoading) {
        return <DataTableSkeleton columnCount={5} />; 
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    {/* FIX 8: Error message */}
                    <h3 className="text-lg font-semibold text-red-600">Error Loading Pregnancy Week Content</h3> 
                    <p className="text-sm text-muted-foreground mt-2">
                        {error instanceof Error ? error.message : "An unexpected error occurred"}
                    </p>
                </div>
            </div>
        );
    }

    // FIX 9, 10, 11: Pass correct data, columns, meta, and search key
    return (
        <PregnancyWeekContentDataTable
            columns={pregnancyWeekContentColumns}
            // FIX 10: Ensure data path is correct (it's the array name we defined)
            data={data?.data?.pregnancyWeekContents || []} 
            meta={{
                // The meta structure is now nested under 'meta'
                total: data?.data?.meta?.total || 0,
                page: data?.data?.meta?.page || 1,
                limit: data?.data?.meta?.limit || perPage,
                hasNext: data?.data?.meta?.hasNext || false, // Use the API's 'hasNext' flag
            }}
            // FIX 11: Search key should match a field the API can search on (e.g., sizeComparison or week)
            // We'll use sizeComparison as it's a string field
            searchKey="sizeComparison" 
            currentPage={page}
            currentPerPage={perPage}
            currentSearch={search}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
        />);
};

export default PregnancyWeekContentDataTableWrapper;