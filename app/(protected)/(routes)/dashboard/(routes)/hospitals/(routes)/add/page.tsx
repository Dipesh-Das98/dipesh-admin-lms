// hospitals/(routes)/add/page.jsx
import React from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import MainForm from "../components/add-hospitals/mainform"; // Correct relative import

const page = () => {
  return (
    <ContentLayout className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {/* You might want to update the icon to something hospital-related, 
                but keeping the current one for now. */}
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Add New Hospital
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in the details below to create a new hospital record. Ensure
              all required fields are completed.
            </p>
          </div>
        </div>
      </div>
      {/* Passing mode="create" to inform MainForm of the intended action */}
      <MainForm mode="create" /> 
    </ContentLayout>
  );
};

export default page;