"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./(routes)/components/data-table-wrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSheet } from "@/hooks/use-sheet";

export default function EventsPage() {
  const { openSheet } = useSheet();

  const handleCreateClick = () => {
    openSheet("event-form", { mode: "create" });
  };

  return (
    <ContentLayout className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">
            View and manage community events
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
