"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
// FIX 1: Import the correct columns
import { pregnancyNutritionColumns } from "./column"; 
import { useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";

// FIX 2: Import the correct action for fetching data
import { getAllPregnancyNutritionTips } from "@/actions/dashboard/pregnancy-nutrition/get-all-pregnancy-nutrition-tips";
// FIX 3: Rename the data table component (assuming you have one named this way)
import { PregnancyNutritionTipDataTable } from "./tableTips";


// FIX 4: Rename the component
const PregnancyNutritionTipsDataTableWrapper = () => {
    const searchParams = useSearchParams();

    // Standard pagination/sorting parameters
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || ITEMS_PER_PAGE;
    const perPage = Number(searchParams.get("perPage")) || ITEMS_PER_PAGE;
    const sortBy = searchParams.get("sortBy") || "";
    const search = searchParams.get("search") || "";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
    
    // Use isRecommended parameter for filtering
    const isRecommended = searchParams.get("isRecommended") === "true"; 

    // FIX 5: Update useQuery hook
    const { data, isLoading, error } = useQuery({
        // FIX 6: Update queryKey
        queryKey: ["pregnancy-nutrition-tips", page, limit, search, sortOrder, isRecommended], 
        // FIX 7: Update queryFn
        queryFn: () => getAllPregnancyNutritionTips({ page, limit, search, sortOrder, isRecommended }),
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
                    {/* FIX 8: Error message */}
                    <h3 className="text-lg font-semibold text-red-600">Error Loading Pregnancy Nutrition Tips</h3> 
                    <p className="text-sm text-muted-foreground mt-2">
                        {error instanceof Error ? error.message : "An unexpected error occurred"}
                    </p>
                </div>
            </div>
        );
    }

    // FIX 9: Pass data, columns, meta, and search key to the correct data table component
    return (
        <PregnancyNutritionTipDataTable
            columns={pregnancyNutritionColumns}
            // FIX 10: Ensure data path is correct
            data={data?.data?.nutrition || []} 
            meta={{
                total: data?.data?.meta.total || 0,
                page: data?.data?.meta.page || 1,
                limit: data?.data?.meta.limit || perPage,
                hasNext:
                    (data?.data?.meta.page || 1) <
                    Math.ceil((data?.data?.meta.total || 0) / (data?.data?.meta.limit || perPage)),
            }}
            // FIX 11: Search key should match the searchable field in your tips (e.g., foodName)
            searchKey="foodName" 
            currentPage={page}
            currentPerPage={perPage}
            currentSearch={search}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
        />);
};

export default PregnancyNutritionTipsDataTableWrapper;