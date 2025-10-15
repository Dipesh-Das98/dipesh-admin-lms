// app/dashboard/pregnancyWeekContent/edit/[id]/page.tsx

import React from "react";
import { notFound } from "next/navigation";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";

// FIX 1: Correct the import name to the component we renamed
import PregnancyWeekContentForm from "../../components/add-pregnancy-tips/mainColumn"; 
// FIX 2: Import the correct data fetching action
import { PregnancyWeekContent } from "@/types/pregnancy.type";
import { getPregnancyWeekContentById } from "@/actions/dashboard/pregnancy/get-pregnancy-by-id";

interface EditPregnancyWeekContentPageProps { // FIX 3: Rename interface
  params: {
    id: string;
  };
}

const EditPregnancyWeekContentPage = async ({ params }: EditPregnancyWeekContentPageProps) => { // FIX 4: Rename component
  const { id } = params;

  // 5. Fetch the Pregnancy Week Content data
  const result = await getPregnancyWeekContentById(id);

  console.log(`Fetched Pregnancy Week Content (ID: ${id}):`, result);

  // 6. Handle failure/not found
  if (!result.success || !result.data) {
    notFound();
  }

  // The fetched data is guaranteed to be a PregnancyWeekContent object here
  const initialValues: PregnancyWeekContent = result.data; 

  // Use week number for the title
  const weekNumber = initialValues.week; 

  return (
    <ContentLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {/* Using an appropriate icon for health/pregnancy */}
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {/* FIX 6: Update Title, including the week number for context */}
              Edit Content for Week {weekNumber}
            </h1>
            <p className="text-muted-foreground mt-1">
              {/* FIX 7: Update Description */}
              Update the fetal milestones, maternal changes, and media links for this week.
            </p>
          </div>
        </div>
      </div>

      {/* FIX 8: Use the correct component name and pass the fetched data */}
      <PregnancyWeekContentForm mode="edit" initialValues={initialValues} />
    </ContentLayout>
  );
};

// FIX 9: Export the renamed component
export default EditPregnancyWeekContentPage;