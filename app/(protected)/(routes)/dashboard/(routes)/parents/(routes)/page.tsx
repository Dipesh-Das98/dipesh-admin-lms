"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/data-table-wrapper";

export default function ParentsPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Parents Management</h1>
        <p className="text-muted-foreground">
          Manage parent accounts and their permissions
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
