"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/data-table-wrapper";

export default function MoviesPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Movies Management</h1>
        <p className="text-muted-foreground">
          Manage movie content and organize learning materials by grade and language
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
