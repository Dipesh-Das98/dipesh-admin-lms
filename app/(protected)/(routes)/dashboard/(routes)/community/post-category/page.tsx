"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./(routes)/components/data-table-wrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSheet } from "@/hooks/use-sheet";

export default function PostCategoriesPage() {
  const { openSheet } = useSheet();

  const handleCreateClick = () => {
    openSheet("post-category-form", { mode: "create" });
  };

  return (
    <ContentLayout className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Post Categories Management</h1>
          <p className="text-muted-foreground">
            View and manage community post categories
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post Category
        </Button>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
