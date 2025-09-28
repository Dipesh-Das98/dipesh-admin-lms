"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import ReadAlongDataTableWrapper from "./components/dataTableReadAlongWith";

export default function ChildrenPage() {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Read Along With Content</h1>
        <p className="text-muted-foreground">
          Manage read along with content
        </p>
      </div>
      <div className="mt-6">
        <ReadAlongDataTableWrapper />
      </div>
    </ContentLayout>
  );
}
