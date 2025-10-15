// actions/dashboard/pregnancyWeekContent/add/page.tsx

import React from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import PregnancyWeekContentForm from "../components/add-pregnancy-tips/mainColumn";

const AddPregnancyWeekContentPage = () => { // FIX: Rename component
  return (
    <ContentLayout className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {/* Keeping the original icon structure */}
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
              {/* FIX: Update title to match the new resource */}
              Add Pregnancy Week Content
            </h1>
            <p className="text-muted-foreground mt-1">
              {/* FIX: Update description to reflect the resource */}
              Provide fetal milestones, maternal changes, size comparisons, and heartbeat details for a pregnancy week.
            </p>
          </div>
        </div>
      </div>
      {/* FIX: Use the component we renamed, setting mode="create" */}
      <PregnancyWeekContentForm mode="create" />
    </ContentLayout>
  );
};

export default AddPregnancyWeekContentPage; // FIX: Rename the exported component