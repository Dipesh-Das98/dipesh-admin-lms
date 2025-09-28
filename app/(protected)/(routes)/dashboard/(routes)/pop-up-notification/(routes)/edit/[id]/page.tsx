import React from "react";
import { notFound } from "next/navigation";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
// 1. Import the correct MainForm and its types
import MainForm, { PopupNotificationFormValues } from "../../components/add-popup-data/mainform";
// 2. Import the correct data fetching action (placeholder)
// NOTE: Assuming your PopupNotificationTemplate type is globally available or imported
import { getPopupNotificationTemplate } from "@/actions/dashboard/pop-up-notification/get-pop-up-by-id";
import { PopupNotificationTemplate } from "@/types/popup-notification.type";

// Helper interface for the expected API response structure
interface GetPopupNotificationResponse {
  success: boolean;
  data?: PopupNotificationTemplate;
}

interface EditPopUpNotificationPageProps {
  params: {
    id: string;
  };
}

const EditPopUpNotificationPage = async ({ 
  params,
}: EditPopUpNotificationPageProps) => {
  const { id } = params;

  // 3. Fetch the pop-up notification data
  // NOTE: Type casting is necessary if the return type of your action isn't strictly defined
  const result = (await getPopupNotificationTemplate(id)) as GetPopupNotificationResponse; 

  console.log("Fetched Pop-up Notification:", result);

  // 4. Handle failure/not found
  if (!result.success || !result.data) {
    notFound();
  }

  // Helper function to convert ISO 8601 to "YYYY-MM-DDTHH:MM" for datetime-local input
  const toDateTimeLocalFormat = (isoString?: string) => {
    if (!isoString) return "";
    // Note: This relies on the local environment time zone for correct display, 
    // which is the common way to handle 'datetime-local' inputs.
    return new Date(isoString).toJSON().slice(0, 16); 
  }
  
  // 5. Prepare initial values for the form
  const initialValues: Partial<PopupNotificationFormValues> = {
    ...result.data,
    // Convert ISO dates from the fetched data into the format the form inputs expect
    startTime: toDateTimeLocalFormat(result.data.startTime),
    endTime: toDateTimeLocalFormat(result.data.endTime),
  };

  return (
    <ContentLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {/* Pop-up Icon */}
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
            {/* 6. Updated Header Text */}
            <h1 className="text-3xl font-bold text-foreground">
              Edit Pop-up Notification
            </h1>
            <p className="text-muted-foreground mt-1">
              Update the pop-up notification's content, image, and schedule
            </p>
          </div>
        </div>
      </div>

      <MainForm mode="edit" initialValues={initialValues} />
    </ContentLayout>
  );
};

export default EditPopUpNotificationPage;