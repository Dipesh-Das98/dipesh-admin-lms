"use client";

import React from "react";
import { parentColumns } from "./parent-columns";
import { DataTable } from "@/components/ui/data-table/pagination-data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";
import { getParents } from "@/actions/dashboard/parent/get-parents";

const RecentParent = () => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["parents"],
    queryFn: () => getParents(1, 10),
  });

  if (isLoading || isFetching) {
    return <DataTableSkeleton columnCount={5} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Parents</h2>
          <span className="text-sm text-muted-foreground">
            {data?.data.parents.length} parents
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          searchKey="username"
          columns={parentColumns}
          data={data?.data.parents || []}
          alignment="align-bottom"
        />
      </CardContent>
    </Card>
  );
};

export default RecentParent;
