// /dashboard/pop-up-notifications/add/page.tsx

import React from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import MainForm from "../components/add-popup-data/mainform";

const PopUpAddPage = () => {
  return (
    <ContentLayout className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {/* Pop-up Icon (Placeholder for now) */}
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9a9 9 0 01-9 9m0-9a9 9 0 009-9"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Add New Pop-up Notification
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure the content, schedule, and image for a new pop-up message.
            </p>
          </div>
        </div>
      </div>
      <MainForm mode="create" />
    </ContentLayout>
  );
};

export default PopUpAddPage;