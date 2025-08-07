import React from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import MainForm from "../../components/add-story/mainform";

const page = () => {
  return (
    <ContentLayout className="space-y-6">
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Add Read Along With Content
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in the details below to create a new read along with content. Ensure
              all required fields are completed.
            </p>
          </div>
        </div>
      </div>
      <MainForm mode="create" />
    </ContentLayout>
  );
};

export default page;
