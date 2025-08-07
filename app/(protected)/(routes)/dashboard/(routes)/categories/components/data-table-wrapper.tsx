"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { CategoriesDataTable } from "./categories-data-table";
import { categoryColumns } from "./columns";
import { getCategories } from "@/actions/dashboard/category/get-categories";
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
  const type = searchParams.get("type") || "";
  const isPublished = searchParams.get("isPublished") ? searchParams.get("isPublished") === "true" : undefined;
  const language = searchParams.get("language") || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories", page, perPage, search, sortBy, sortOrder, type, isPublished, language],
    queryFn: () => getCategories(page, perPage, search, sortBy, sortOrder, type, isPublished, language),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={9} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error Loading Categories</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <CategoriesDataTable
      columns={categoryColumns}
      data={data?.data?.categories || []}
      meta={
        data?.data?.meta || {
          total: 0,
          page: 1,
          limit: perPage,
          hasNext: false,
        }
      }
      searchKey="name"
      currentPage={page}
      currentPerPage={perPage}
      currentSearch={search}
      currentType={type}
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
};

export default DataTableWrapper;
