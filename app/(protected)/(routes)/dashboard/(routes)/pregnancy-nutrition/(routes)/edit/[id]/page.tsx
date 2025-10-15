import React from "react";
import { notFound } from "next/navigation";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";

// FIX: Correct the import path and component name from TableTips to MainColumn
import MainColumn from "../../components/add-pregnancy-tips/mainColumn";
import { getPregnancyNutritionTipById } from "@/actions/dashboard/pregnancy-nutrition/get-pregnancy-nutrition-tip-by-id";

// 2. Import the correct data fetching action (This is correct)

// NOTE: We rely on the internal Next.js PageProps type structure for async components, 
// so we define the type directly in the function signature.
interface EditSymptomTipPageProps {
  params: {
    id: string;
  };
}

const EditSymptomReliefTipPage = async ({ params }: EditSymptomTipPageProps) => {
  const { id } = params;

  // 3. Fetch the Symptom Relief Tip data
  // We use the action created earlier which returns the structured response.
  const result = await getPregnancyNutritionTipById(id);

  console.log(`Fetched Symptom Tip (ID: ${id}):`, result);

  // 4. Handle failure/not found
  if (!result.success || !result.data) {
    notFound();
  }

  // 5. initialValues is the fetched data object (SymptomReliefTip type)
  const initialValues = result.data;

  return (
    <ContentLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {/* Using an appropriate icon for tips/health */}
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
              Edit Symptom Relief Tip
            </h1>
            <p className="text-muted-foreground mt-1">
              Update the symptom name, tip content, and status.
            </p>
          </div>
        </div>
      </div>

      {/* FIX: Use the MainColumn component */}
      <MainColumn mode="edit" initialValues={initialValues} />
    </ContentLayout>
  );
};

export default EditSymptomReliefTipPage;