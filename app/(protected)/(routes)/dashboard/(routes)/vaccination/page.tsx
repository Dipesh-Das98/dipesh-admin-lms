"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import VaccinationDataTableWrapper from "./(routes)/components/dataTableVaccination";

export default function VaccinationPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vaccination Management</h1>
        <p className="text-muted-foreground">
          Manage vaccination schedules
        </p>
      </div>
      <div className="mt-6">

        <VaccinationDataTableWrapper />
      </div>
    </ContentLayout>
  );
}