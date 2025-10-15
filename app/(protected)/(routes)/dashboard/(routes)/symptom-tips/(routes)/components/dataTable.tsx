"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
// FIX: Import the correct columns
import { symptomTipColumns } from "./column"; 
import { useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";

// FIX: Import the correct action for fetching data
// FIX: Rename the data table component (assuming you have one named this way)
import { getAllSymptomReliefTips } from "@/actions/dashboard/symptom-relief/get-all-symptom-relief-tips";
import { SymptomReliefTipDataTable } from "./tableTips";


// FIX: Rename the component
const SymptomReliefTipsDataTableWrapper = () => {
    const searchParams = useSearchParams();

    // Standard pagination/sorting parameters
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || ITEMS_PER_PAGE;
    const perPage = Number(searchParams.get("perPage")) || ITEMS_PER_PAGE;
    const sortBy = searchParams.get("sortBy") || "";
    const search = searchParams.get("search") || "";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
    // isActive parameter is commonly used for filtering
    const isActive = searchParams.get("isActive") === "true"; 

    // FIX: Update useQuery hook
    const { data, isLoading, error } = useQuery({
        // FIX: Update queryKey
        queryKey: ["symptom-relief-tips", page, limit, search, sortOrder, isActive], 
        // FIX: Update queryFn
        queryFn: () => getAllSymptomReliefTips({ page, limit, search, sortOrder, isActive }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    if (isLoading) {
        // Assuming your skeleton component is generic enough
        return <DataTableSkeleton columnCount={5} />; 
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    {/* FIX: Error message */}
                    <h3 className="text-lg font-semibold text-red-600">Error Loading Symptom Relief Tips</h3> 
                    <p className="text-sm text-muted-foreground mt-2">
                        {error instanceof Error ? error.message : "An unexpected error occurred"}
                    </p>
                </div>
            </div>
        );
    }

    // FIX: Pass data, columns, meta, and search key to the data table component
    return (
        <SymptomReliefTipDataTable
            columns={symptomTipColumns}
            // FIX: Ensure data path is correct (e.g., data?.data?.tips instead of variety)
            data={data?.data?.symptomReliefTips || []} 
            meta={{
                total: data?.data?.meta.total || 0,
                page: data?.data?.meta.page || 1,
                limit: data?.data?.meta.limit || perPage,
                hasNext:
                    (data?.data?.meta.page || 1) <
                    Math.ceil((data?.data?.meta.total || 0) / (data?.data?.meta.limit || perPage)),
            }}
            // FIX: Search key should match the searchable field in your tips (e.g., symptomName)
            searchKey="symptomName" 
            currentPage={page}
            currentPerPage={perPage}
            currentSearch={search}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
        />);
};

export default SymptomReliefTipsDataTableWrapper;