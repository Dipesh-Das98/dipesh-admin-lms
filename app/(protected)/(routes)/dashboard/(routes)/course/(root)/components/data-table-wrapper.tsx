"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { CourseDataTable } from "./course-data-table";
import { courseColumns } from "./columns";
import { getCourses } from "@/actions/dashboard/course/get-courses";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";
import { useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/lib/constants";

const DataTableWrapper = () => {
  const searchParams = useSearchParams();
  
  // Parse URL params with defaults
  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("perPage")) || ITEMS_PER_PAGE;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const language = searchParams.get("language") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const { data, isLoading, error } = useQuery({
    queryKey: ["courses", page, perPage, search, sortBy, sortOrder, category, language],
    queryFn: () => getCourses(page, perPage, search, sortBy, sortOrder, category, language),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={8} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error Loading Courses</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <CourseDataTable
      columns={courseColumns}
      data={data?.data?.courses || []}
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
      currentCategory={category}
      currentLanguage={language}
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
};

export default DataTableWrapper;
