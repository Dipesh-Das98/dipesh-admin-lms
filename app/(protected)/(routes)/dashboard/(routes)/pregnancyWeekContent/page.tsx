"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import PregnancyWeekContentDataTableWrapper from "./(routes)/components/dataTable";

export default function SymptomTips() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pregnancy Week Content</h1>
        <p className="text-muted-foreground">
          Manage Content
        </p>
      </div>
      <div className="mt-6">

        <PregnancyWeekContentDataTableWrapper />
      </div>
    </ContentLayout>
  );
}