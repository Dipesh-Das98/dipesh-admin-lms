import React from "react";
import { notFound } from "next/navigation";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import MainForm from "../../components/add-push-data/mainform"; 

import { PushNotificationTemplate } from "@/types/push-notification.type";
import { getPushNotificationTemplate } from "@/actions/dashboard/push-notification/get-push-notification-by-id";

interface EditPushNotificationPageProps {
  params: {
    id: string;
  };
}

const EditPushNotificationPage = async ({ 
  params,
}: EditPushNotificationPageProps) => {
  const { id } = params;

  // Type assertion for better data handling
  const result: { success: boolean; data?: PushNotificationTemplate } = 
    await getPushNotificationTemplate(id);

  console.log("Fetched Push Notification:", result);

  if (!result.success || !result.data) {
    notFound();
  }
  
  // NOTE: We rely on the toDateTimeLocalFormat logic in MainForm to handle ISO dates
  const initialValues = result.data; 

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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            {/* 4. Updated Header */}
            <h1 className="text-3xl font-bold text-foreground">
              Edit Push Notification
            </h1>
            {/* 5. Updated Description */}
            <p className="text-muted-foreground mt-1">
              Update the push notification content
            </p>
          </div>
        </div>
      </div>

      <MainForm mode="edit" initialValues={initialValues} />
    </ContentLayout>
  );
};

export default EditPushNotificationPage;