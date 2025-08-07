"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
// Placeholder for actual DataTable component
// Placeholder for actual column definitions
import { readAlongColumns } from "./column";
// Placeholder for skeleton loader component
import { useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { getAllReadAlongStories } from "@/actions/dashboard/readAlongWith/get-all-read-along-with";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";
import { ReadAlongDataTable } from "./read-along-data-table";

const ReadAlongDataTableWrapper = () => {
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || ITEMS_PER_PAGE;
    const perPage = Number(searchParams.get("perPage")) || ITEMS_PER_PAGE;
    const sortBy = searchParams.get("sortBy") || "";
    const search = searchParams.get("search") || "";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
    const isActive = searchParams.get("isActive") === "true"; // required param

    const { data, isLoading, error } = useQuery({
        queryKey: ["read-along-stories", page, limit, search, sortOrder, isActive],
        queryFn: () => getAllReadAlongStories({ page, limit, search, sortOrder, isActive }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    if (isLoading) {
        return <DataTableSkeleton columnCount={9} />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-red-600">Error Loading Stories</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        {error instanceof Error ? error.message : "An unexpected error occurred"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ReadAlongDataTable
            columns={readAlongColumns}
            data={data?.data?.readAlongStories || []} // ✅ FIXED from readAlongStories to stories
            meta={{
                total: data?.data?.total || 0,
                page: data?.data?.page || 1,
                limit: data?.data?.limit || perPage,
                hasNext:
                    (data?.data?.page || 1) <
                    Math.ceil((data?.data?.total || 0) / (data?.data?.limit || perPage)),
            }}
            searchKey="title"
            currentPage={page}
            currentPerPage={perPage}
            currentSearch={search}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
        />);
};

export default ReadAlongDataTableWrapper;
