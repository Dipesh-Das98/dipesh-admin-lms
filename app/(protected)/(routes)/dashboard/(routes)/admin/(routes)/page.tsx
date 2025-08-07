"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/data-table-wrapper";

export default function AdminPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Management</h1>
        <p className="text-muted-foreground">
          Manage admin accounts and their permissions
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
