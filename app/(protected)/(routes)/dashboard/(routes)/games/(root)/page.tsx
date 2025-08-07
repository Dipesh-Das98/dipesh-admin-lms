"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/data-table-wrapper";

export default function GamesPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Games Management</h1>
        <p className="text-muted-foreground">
          Manage interactive games and organize learning materials by language and category
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}