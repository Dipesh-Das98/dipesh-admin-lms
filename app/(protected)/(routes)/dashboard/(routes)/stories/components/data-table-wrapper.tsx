"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StoriesDataTable } from "./stories-data-table";
import { storyColumns } from "./columns";
import { getStories } from "@/actions/dashboard/story/get-stories";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";
import { useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/lib/constants";

const DataTableWrapper = () => {
  const searchParams = useSearchParams();
  
  // Parse URL params with defaults
  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("perPage")) || ITEMS_PER_PAGE;
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const { data, isLoading, error } = useQuery({
    queryKey: ["stories", page, perPage, search, sortBy, sortOrder],
    queryFn: () => getStories(page, perPage, search, sortBy, sortOrder),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={7} />;
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
    <StoriesDataTable
      columns={storyColumns}
      data={data?.data?.stories || []}
      meta={
        data?.data?.meta || {
          total: 0,
          page: 1,
          limit: perPage,
          hasNext: false,
        }
      }
      searchKey="title"
      currentPage={page}
      currentPerPage={perPage}
      currentSearch={search}
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
};

export default DataTableWrapper;
