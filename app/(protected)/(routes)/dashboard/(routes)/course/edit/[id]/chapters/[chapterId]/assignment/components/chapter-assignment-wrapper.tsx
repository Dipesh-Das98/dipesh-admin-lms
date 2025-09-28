"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useChapter } from "@/hooks/use-chapter";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { Banner } from "@/components/ui/banner";
import { IconBadge } from "@/components/ui/icon-badge";
import ChapterAssignmentForm from "./chapter-assignment-form";

interface ChapterAssignmentWrapperProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const ChapterAssignmentWrapper: React.FC<ChapterAssignmentWrapperProps> = ({
  params,
}) => {
  const { data, isLoading, isError, refetch } = useChapter(params.chapterId);

  // Handle loading state
  if (isLoading) {
    return (
      <ContentLayout>
        <LoadingState
          message="Loading chapter assignment..."
          showContainer={false}
        />
      </ContentLayout>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <ContentLayout className="space-y-6">
        <ErrorState
          title="Something went wrong"
          message="Failed to load chapter assignment data. Please try again."
          onRetry={() => refetch()}
          retryText="Try Again"
          minHeight="400px"
        />
      </ContentLayout>
    );
  }

  const chapter = data?.data;

  // Handle chapter not found
  if (!chapter) {
    return (
      <ContentLayout className="space-y-6">
        <ErrorState
          title="Chapter Not Found"
          message="The chapter you're looking for doesn't exist or has been deleted."
          onRetry={() =>
            (window.location.href = `/dashboard/course/edit/${params.courseId}`)
          }
          retryText="Back to Course"
          minHeight="400px"
        />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout className="space-y-6">
      <div className="">
        {!chapter.isPublished && (
          <Banner
            label="This chapter is not published yet. The assignment will not be accessible to students."
            variant="warning"
          />
        )}

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="w-full">
            {/* Back button */}
            <Link
              href={`/dashboard/course/edit/${params.courseId}/chapters/${params.chapterId}`}
              className="flex items-center text-sm w-fit transition mb-6 hover:opacity-70"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to chapter
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-y-2 justify-between">
              <h1 className="text-2xl font-bold">Chapter Assignment</h1>
              <p className="text-sm text-muted-foreground">
                Create and manage assignments for &ldquo;{chapter.title}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8">
          <div className="space-y-6">
            {/* Assignment Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={BookOpen} variant="primary" />
                <h2 className="text-xl font-semibold">Quiz Assignment</h2>
              </div>

              <ChapterAssignmentForm
                chapterId={params.chapterId}
                courseId={params.courseId}
                initialData={chapter}
              />
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default ChapterAssignmentWrapper;
