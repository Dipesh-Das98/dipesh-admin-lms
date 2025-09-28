"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/data-table-wrapper";

export default function StoriesPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stories Management</h1>
        <p className="text-muted-foreground">
          Manage story content and organize learning materials by grade and language
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
