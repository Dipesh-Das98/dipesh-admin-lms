"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import VarietyDataTableWrapper from "./(routes)/components/dataTableVariety";

export default function VarietyPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Variety Content</h1>
        <p className="text-muted-foreground">
          Manage variety content
        </p>
      </div>
      <div className="mt-6">

        <VarietyDataTableWrapper />
      </div>
    </ContentLayout>
  );
}

// Variety done