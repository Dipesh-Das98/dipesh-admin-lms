"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import FamilyHealthDataTableWrapper from "./(routes)/components/dataTableFamilHealth";

export default function FamilyHealthPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Family Health Content</h1>
        <p className="text-muted-foreground">
          Manage family health content
        </p>
      </div>
      <div className="mt-6">

        <FamilyHealthDataTableWrapper />
      </div>
    </ContentLayout>
  );
}
