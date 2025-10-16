// app/hospitals/edit/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import MainForm from "../../components/add-hospitals/mainform";
import { getHospitalById } from "@/actions/dashboard/hospital/getHospitalById"; 
import { HospitalRecord } from "@/types/hospital.type"; 

interface EditHospitalPageProps {
  // FIX: Interface params must be a Promise resolving to an object with id: string
  params: Promise<{
    id: string;
  }>;
}

const EditHospitalPage = async ({ params }: EditHospitalPageProps) => {
  // FIX: Await the params object to extract the id
  const { id } = await params;

  // Fetch the hospital data
  const result = await getHospitalById(id);

  console.log("Fetched Hospital Record:", result);

  if (!result.success || !result.data) {
    notFound();
  }

  const initialValues: HospitalRecord = result.data;

  return (
    <ContentLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Edit Hospital: {initialValues.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Update the hospital's information, vaccination details, and settings
            </p>
          </div>
        </div>
      </div>

      <MainForm mode="edit" initialValues={initialValues} />
    </ContentLayout>
  );
};

export default EditHospitalPage;