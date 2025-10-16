// app/hospitals/page.tsx (Example Path)
"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import HospitalDataTableWrapper from "./(routes)/components/dataTablehelptopics";

export default function HospitalsPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hospital Management</h1>
        <p className="text-muted-foreground">
          Manage hospital records, vaccination details, and scheduling slots.
        </p>
      </div>
      <div className="mt-6">
        {/* FIX 2: Render the Hospital data table wrapper */}
        <HospitalDataTableWrapper />
      </div>
    </ContentLayout>
  );
}