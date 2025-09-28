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
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";

interface ServerPaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

interface PopNotificationTableProp<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: ServerPaginationMeta;
  searchKey?: string;
  currentPage: number;
  currentPerPage: number;
  currentSearch: string;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  alignment?: "align-top" | "align-bottom" | "align-middle";
  pageSizeOptions?: number[];
}

export function PopNotificationTable<TData, TValue>({
  columns,
  data,
  meta,
  searchKey,
  currentPage,
  currentPerPage,
  currentSearch,
  currentSortBy = "",
  currentSortOrder = "desc",
  alignment = "align-middle",
  pageSizeOptions = [10, 20, 30, 40, 50],
}: PopNotificationTableProp<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  React.useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  React.useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams);

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }

      params.set("page", "1");
      router.push(`?${params.toString()}`);
    }
  }, [debouncedSearch, currentSearch, router, searchParams]);

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
  }) => {
    const params = new URLSearchParams(searchParams);

    if (updates.page !== undefined) params.set("page", updates.page.toString());
    if (updates.perPage !== undefined) {
      params.set("perPage", updates.perPage.toString());
      params.set("page", "1");
    }
    if (updates.search !== undefined) {
      if (updates.search) {
        params.set("search", updates.search);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex gap-4 items-center justify-between py-4">
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
      </div>

      <div className="rounded-md border border-dashed">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-bold p-4 text-center"
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
            {table.getRowModel().rows.length ? (
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

      <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8 mt-4">
        <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
          Showing {data.length} of {meta.total} results
        </div>

        <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <p className="whitespace-nowrap text-sm font-medium">
              Rows per page
            </p>
            <Select
              value={`${currentPerPage}`}
              onValueChange={(value) =>
                updateURL({ perPage: Number(value) })
              }
            >
              <SelectTrigger className="h-8 w-[4.5rem]">
                <SelectValue placeholder={currentPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
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
              variant="outline"
              className="hidden size-8 p-0 lg:flex"
              onClick={() => updateURL({ page: 1 })}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => updateURL({ page: currentPage - 1 })}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => updateURL({ page: currentPage + 1 })}
              disabled={!meta.hasNext}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => updateURL({ page: totalPages })}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}