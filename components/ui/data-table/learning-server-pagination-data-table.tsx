"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import { useCategory } from "@/hooks/use-category";
import { Category } from "@/types";import { languageOptions } from "@/config/forms/common-form-options";

interface ServerPaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

interface LearningServerPaginationDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: ServerPaginationMeta;
  actions?: React.ReactNode;
  searchKey?: string;
  currentPage: number;
  currentPerPage: number;
  currentSearch: string;
  currentCategory?: string;
  currentLanguage?: string;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  alignment?: "align-top" | "align-bottom" | "align-middle";
  pageSizeOptions?: number[];
  categoryType: "ethics" | "library" | "music" | "movie" | "language_corner";
}

export function LearningServerPaginationDataTable<TData, TValue>({
  columns,
  data,
  meta,
  searchKey,
  actions,
  currentPage,
  currentPerPage,
  currentSearch,
  currentCategory = "",
  currentLanguage = "",
  currentSortBy = "",
  currentSortOrder = "desc",
  alignment = "align-middle",
  categoryType,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: LearningServerPaginationDataTableProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize sorting state from URL parameters
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    if (currentSortBy) {
      return [{ id: currentSortBy, desc: currentSortOrder === "desc" }];
    }
    return [];
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [searchValue, setSearchValue] = React.useState(currentSearch);
  const [debouncedSearch] = useDebounce(searchValue, 1000);

  // Category filter state
  const [categoryFilterOpen, setCategoryFilterOpen] = React.useState(false);
  // Language filter state
  const [languageFilterOpen, setLanguageFilterOpen] = React.useState(false);

  // Fetch categories for the filter
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategory<Category[]>(categoryType);

  // Update sorting state when URL sorting parameters change
  React.useEffect(() => {
    if (currentSortBy) {
      setSorting([{ id: currentSortBy, desc: currentSortOrder === "desc" }]);
    } else {
      setSorting([]);
    }
  }, [currentSortBy, currentSortOrder]);

  // Update search value when currentSearch changes (from URL)
  React.useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // Update URL when search changes (but not on initial load)
  React.useEffect(() => {
    // Only update URL if search actually changed from current URL search
    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams);

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }

      // Reset to page 1 when searching
      params.set("page", "1");

      router.push(`?${params.toString()}`);
    }
  }, [debouncedSearch, currentSearch, router, searchParams]);

  // Handle sorting changes and update URL
  const handleSortingChange = React.useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      const params = new URLSearchParams(searchParams);

      if (newSorting.length > 0) {
        const sort = newSorting[0];
        params.set("sortBy", sort.id);
        params.set("sortOrder", sort.desc ? "desc" : "asc");
      } else {
        params.delete("sortBy");
        params.delete("sortOrder");
      }

      // Reset to page 1 when sorting changes
      params.set("page", "1");

      router.push(`?${params.toString()}`);
    },
    [sorting, searchParams, router]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: handleSortingChange,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.max(1, Math.ceil(meta.total / meta.limit)),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: meta.page - 1,
        pageSize: meta.limit,
      },
    },
  });

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));

  const updateURL = (updates: {
    page?: number;
    perPage?: number;
    search?: string;
    category?: string;
    language?: string;
  }) => {
    const params = new URLSearchParams(searchParams);

    if (updates.page !== undefined) {
      params.set("page", updates.page.toString());
    }

    if (updates.perPage !== undefined) {
      params.set("perPage", updates.perPage.toString());
      // Reset to page 1 when changing page size
      params.set("page", "1");
    }

    if (updates.search !== undefined) {
      if (updates.search) {
        params.set("search", updates.search);
      } else {
        params.delete("search");
      }
      // Reset to page 1 when searching
      params.set("page", "1");
    }

    if (updates.category !== undefined) {
      if (updates.category) {
        params.set("category", updates.category);
      } else {
        params.delete("category");
      }
      // Reset to page 1 when changing category
      params.set("page", "1");
    }

    if (updates.language !== undefined) {
      if (updates.language) {
        params.set("language", updates.language);
      } else {
        params.delete("language");
      }
      // Reset to page 1 when changing language
      params.set("page", "1");
    }

    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateURL({ page });
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const pageSize = Number(newPageSize);
    updateURL({ perPage: pageSize });
  };

  const handleCategoryFilter = (categoryId: string) => {
    updateURL({ category: categoryId });
    setCategoryFilterOpen(false);
  };

  const clearCategoryFilter = () => {
    updateURL({ category: "" });
  };

  const handleLanguageFilter = (languageValue: string) => {
    updateURL({ language: languageValue });
    setLanguageFilterOpen(false);
  };

  const clearLanguageFilter = () => {
    updateURL({ language: "" });
  };

  const selectedCategory = categories.find(
    (cat: Category) => cat.id === currentCategory
  );
  const selectedLanguage = languageOptions.find(
    (lang) => lang.value === currentLanguage
  );

  return (
    <div>
      <div className="flex gap-4 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          {searchKey && (
            <div className="flex border bg-card items-center rounded-md gap-2 max-w-sm w-full">
              <Search className="h-6 w-6 text-gray-400 ml-2" />
              <Input
                placeholder={`Search by ${searchKey}`}
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="w-full border-none outline-none dark:bg-card ring-transparent focus-visible:ring-0 shadow-none"
              />
            </div>
          )}

          {/* Category Filter */}
          <Popover
            open={categoryFilterOpen}
            onOpenChange={setCategoryFilterOpen}
          >
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-dashed ">
                Category
                {selectedCategory && (
                  <>
                    <div className="ml-2 h-4 w-0.5 bg-border" />
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal ml-2 bg-gray-950"
                    >
                      {selectedCategory.name}
                    </Badge>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="space-y-1 p-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Categories</h4>
                  {currentCategory && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={clearCategoryFilter}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="max-h-64 overflow-auto">
                  {categoriesLoading ? (
                    <div className="py-2 text-center text-sm text-muted-foreground">
                      Loading categories...
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="py-2 text-center text-sm text-muted-foreground">
                      No categories found
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {categories.map((category: Category) => (
                        <button
                          key={category.id}
                          className={cn(
                            "w-full flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                            currentCategory === category.id && "bg-accent"
                          )}
                          onClick={() => handleCategoryFilter(category.id)}
                        >
                          <span>{category.name}</span>
                          {currentCategory === category.id && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Language Filter */}
          {categoryType !== "language_corner" && (
            <Popover
              open={languageFilterOpen}
              onOpenChange={setLanguageFilterOpen}
            >
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-dashed">
                  Language
                  {selectedLanguage && (
                    <>
                      <div className="ml-2 h-4 w-0.5 bg-border" />
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal ml-2 bg-gray-950"
                      >
                        {selectedLanguage.label}
                      </Badge>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="space-y-1 p-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Languages</h4>
                    {currentLanguage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={clearLanguageFilter}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-auto">
                    <div className="space-y-1">
                      {languageOptions.map((language) => (
                        <button
                          key={language.value}
                          className={cn(
                            "w-full flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                            currentLanguage === language.value && "bg-accent"
                          )}
                          onClick={() => handleLanguageFilter(language.value)}
                        >
                          <span>{language.label}</span>
                          {currentLanguage === language.value && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {actions && <div className="flex items-center">{actions}</div>}
      </div>

      {/* Table */}
      <div className="rounded-md border border-dashed">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="font-bold p-4 text-center"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn(alignment, "p-3")}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8 mt-4">
        <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
          Showing {data.length} of {meta.total} results
          {(selectedCategory || selectedLanguage) && (
            <span className="ml-2">
              • Filtered by:
              {selectedCategory && (
                <strong className="ml-1">{selectedCategory.name}</strong>
              )}
              {selectedCategory && selectedLanguage && (
                <span className="mx-1">•</span>
              )}
              {selectedLanguage && (
                <strong className="ml-1">{selectedLanguage.label}</strong>
              )}
            </span>
          )}
        </div>

        <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <p className="whitespace-nowrap text-sm font-medium">
              Rows per page
            </p>
            <Select
              value={`${currentPerPage}`}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[4.5rem]">
                <SelectValue placeholder={currentPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden size-8 p-0 lg:flex"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="size-4" aria-hidden="true" />
            </Button>

            <Button
              aria-label="Go to previous page"
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>

            <Button
              aria-label="Go to next page"
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!meta.hasNext}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>

            <Button
              aria-label="Go to last page"
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
