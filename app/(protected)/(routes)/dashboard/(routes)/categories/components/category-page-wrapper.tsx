"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./data-table-wrapper";

const CategoryPageWrapper = () => {

  return (
    <ContentLayout>
      <div>
        <h1 className="text-3xl font-bold">Category Management</h1>
        <p className="text-muted-foreground">
          Manage categories for organizing courses and content
        </p>
      </div>

      {/* Category Data Table */}
      <div className="mt-6">
        <DataTableWrapper />
      </div>
    </ContentLayout>
  );
};

export default CategoryPageWrapper;
