"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import HelpTopicDataTableWrapper from "./(routes)/components/dataTablehelptopics";

export default function VarietyPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">TenaChat Content</h1>
        <p className="text-muted-foreground">
          Manage quickHelp content
        </p>
      </div>
      <div className="mt-6">

        <HelpTopicDataTableWrapper />
      </div>
    </ContentLayout>
  );
}