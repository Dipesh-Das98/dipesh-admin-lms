// vaccination/(routes)/table/data-table-wrapper.tsx (or dataTableVaccination.tsx)
"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
// 2. UPDATED COLUMN IMPORT
import { vaccinationColumns } from "./column"; 
import { useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";
import { VaccinationDataTable } from "./vaccination-data-table"; 
import { getAllVaccinations } from "@/actions/dashboard/vaccination/getAllVaccinations";


// 1. UPDATED WRAPPER NAME
const VaccinationDataTableWrapper = () => {
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || ITEMS_PER_PAGE;
    // Removed unused 'perPage' variable, using 'limit' consistently
    const sortBy = searchParams.get("sortBy") || "";
    const search = searchParams.get("search") || "";
    const sortOrder = (searchParams.get("sortOrder") as "ASC" | "DESC") || "ASC";
    
    // Convert 'true'/'false' string to boolean for API. Default to true if not set.
    const isActiveParam = searchParams.get("isActive");
    const isActive = isActiveParam === null ? true : isActiveParam === "true"; 

    // 3. UPDATED QUERY KEY AND QUERY FUNCTION
    const { data, isLoading, error } = useQuery({
        // 3. UPDATED QUERY KEY
        queryKey: ["all-vaccinations", page, limit, search, sortOrder, isActive], 
        // 3. UPDATED QUERY FUNCTION
        queryFn: () => getAllVaccinations({ 
            page, 
            limit, 
            search, 
            sortOrder, 
            isActive 
        }), 
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    if (isLoading) {
        // Reduced column count to 6 to match the new table structure (ID, Vax Name, Week, Desc, Status, Actions)
        return <DataTableSkeleton columnCount={6} />; 
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    {/* UPDATED ERROR MESSAGE */}
                    <h3 className="text-lg font-semibold text-red-600">Error Loading Vaccination Records</h3> 
                    <p className="text-sm text-muted-foreground mt-2">
                        {error instanceof Error ? error.message : "An unexpected error occurred"}
                    </p>
                </div>
            </div>
        );
    }

    // Safely destructure data from the response structure
    const vaccinations = data?.data?.vaccinations || [];
    const meta = data?.data?.meta || { total: 0, page: 1, limit: limit, hasNext: false };
    
    return (
        <VaccinationDataTable
            columns={vaccinationColumns} 
            data={vaccinations} 
            meta={{
                total: meta.total,
                page: meta.page,
                limit: meta.limit,
                hasNext: meta.page < Math.ceil(meta.total / meta.limit),
            }}
            searchKey="vaccineName" 
            currentPage={page}
            currentPerPage={limit}
            currentSearch={search}
            currentSortBy={sortBy}
        />
    );
};

// 1. UPDATED EXPORT DEFAULT
export default VaccinationDataTableWrapper;