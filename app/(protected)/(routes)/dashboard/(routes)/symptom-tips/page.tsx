"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import SymptomReliefTipsDataTableWrapper from "./(routes)/components/dataTable";

export default function SymptomTips() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Symptom Tips</h1>
        <p className="text-muted-foreground">
          Manage Symptom Tips
        </p>
      </div>
      <div className="mt-6">

        <SymptomReliefTipsDataTableWrapper />
      </div>
    </ContentLayout>
  );
}