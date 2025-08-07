"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/data-table-wrapper";

export default function MusicPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Music Management</h1>
        <p className="text-muted-foreground">
          Manage music content and organize learning materials by grade and language
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
