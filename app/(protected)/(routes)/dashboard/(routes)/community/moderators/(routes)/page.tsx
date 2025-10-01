"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/data-table-wrapper";

export default function ModeratorsPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Moderators Management</h1>
        <p className="text-muted-foreground">
          View community moderators and their activity
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
