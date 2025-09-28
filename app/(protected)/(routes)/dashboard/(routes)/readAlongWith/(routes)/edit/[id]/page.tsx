import React from "react";
import { notFound } from "next/navigation";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import MainForm from "../../../components/add-story/mainform";
import { getReadAlongStoryById } from "@/actions/dashboard/readAlongWith/get-read-along-stories-by-id";

interface EditChildPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditReadAlongStory = async ({ params }: EditChildPageProps) => {
  const { id } = await params;

  const result = await getReadAlongStoryById(id);

  console.log("Fetched story:", result);

  if (!result.success || !result.data) {
    notFound();
  }

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
            <h1 className="text-3xl font-bold text-foreground">
              Edit Read Along With Content
            </h1>
            <p className="text-muted-foreground mt-1">
              Update replace here with &apos;s information and settings
            </p>
          </div>
        </div>
      </div>

      <MainForm mode="edit" initialValues={initialValues} />
    </ContentLayout>
  );
};

export default EditReadAlongStory;
