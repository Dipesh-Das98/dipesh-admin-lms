import React from "react";
import { notFound } from "next/navigation";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { getReadAlongStoryById } from "@/actions/dashboard/readAlongWith/get-read-along-stories-by-id";
import SlideManager from "../../../components/manage-slides/SlideManager";

interface ManageSlidesProps {
  params: Promise<{
    id: string;
  }>;
}

const ManageSlides = async ({ params }: ManageSlidesProps) => {
  const { id } = await params;

  const result = await getReadAlongStoryById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const initialValues = result.data;

  return (
    <ContentLayout>
      {/* Header */}
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
              Manage slides for each story
            </h1>
            <p className="text-muted-foreground mt-1">
              Update the slides information and settings here.
            </p>
          </div>
        </div>
      </div>

      {/*  Mount SlideManager here */}
      <SlideManager storyId={initialValues.id} />
    </ContentLayout>
  );
};

export default ManageSlides;
