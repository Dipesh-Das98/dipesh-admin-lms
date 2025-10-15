import React from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
// FIX: Correct the import name to MainColumn, based on the structure
import MainColumn from "../components/add-tips/mainColumn"; 

const AddSymptomReliefTipPage = () => {
  return (
    <ContentLayout className="space-y-6">
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
              Add Symptom Relief Tip
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in the symptom name and the corresponding relief tip.
            </p>
          </div>
        </div>
      </div>
      {/* FIX: Use the MainColumn component */}
      <MainColumn mode="create" />
    </ContentLayout>
  );
};

export default AddSymptomReliefTipPage;