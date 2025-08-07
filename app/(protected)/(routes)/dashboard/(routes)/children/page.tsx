"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/data-table-wrapper";

export default function ChildrenPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Children Management</h1>
        <p className="text-muted-foreground">
          Manage child accounts and their learning progress
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
