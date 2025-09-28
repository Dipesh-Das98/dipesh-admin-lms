"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/data-table-wrapper";

export default function LanguageCornerPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Language Corner Management</h1>
        <p className="text-muted-foreground">
          Manage language learning content and organize materials by grade and language
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
