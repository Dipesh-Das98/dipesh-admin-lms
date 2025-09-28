"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import PushNotificationDataTable from "./(routes)/components/dataTable";

export default function VarietyPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Push Notification</h1>
        <p className="text-muted-foreground">
          Manage push notification
        </p>
      </div>
      <div className="mt-6">

        <PushNotificationDataTable />
      </div>
    </ContentLayout>
  );
}