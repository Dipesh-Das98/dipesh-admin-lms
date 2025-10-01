"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./(routes)/components/data-table-wrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TipsPage() {
  return (
    <ContentLayout className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tips Management</h1>
          <p className="text-muted-foreground">
            View and manage educational tips and advice
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/community/tip/add">
            <Plus className="h-4 w-4 mr-2" />
            Create Tip
          </Link>
        </Button>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
}
