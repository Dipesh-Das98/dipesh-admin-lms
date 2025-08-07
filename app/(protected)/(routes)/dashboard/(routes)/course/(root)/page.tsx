"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/data-table-wrapper";

export default function CoursePage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">
          Manage courses and organize learning materials by grade, language, and category
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
