"use client";

import Link from "next/link";
import {
  ArrowLeft,
  LayoutDashboard,
  PenBox,
  Video,
} from "lucide-react";

import { IconBadge } from "@/components/ui/icon-badge";
import ChapterActions from "./chapter-actions";
import ChapterTitleForm from "./chapter-title-form";
import ChapterDescriptionForm from "./chapter-description-form";
import ChapterVideoForm from "./chapter-video-form";
import ChapterAssignment from "./chapter-assignment";
import { useChapter } from "@/hooks/use-chapter";
import { Banner } from "@/components/ui/banner";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { LoadingState, ErrorState } from "@/components/ui/states";

interface ChapterPageWrapperProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}
const ChapterPageWrapper = ({ params }: ChapterPageWrapperProps) => {
  const { data, isLoading, isError,refetch } = useChapter(params.chapterId);

  // Handle loading state
  if (isLoading) {
    return (
      <ContentLayout>
        <LoadingState message="Loading chapter data..." showContainer={false} />
      </ContentLayout>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <ContentLayout className="space-y-6">
        <ErrorState
          title="Something went wrong"
          message="Failed to load chapter data. Please try again."
          onRetry={() => refetch()}
          retryText="Try Again"
          minHeight="400px"
        />
      </ContentLayout>
    );
  }

  //   ---------------------------------------state---------------------------------------
  const chapter = data?.data;

  // Handle chapter not found
  if (!chapter) {
    return (
      <ContentLayout className="space-y-6">
        <ErrorState
          title="Chapter Not Found"
          message="The chapter you're looking for doesn't exist or has been deleted."
          onRetry={() => window.location.href = `/dashboard/course/edit/${params.courseId}`}
          retryText="Back to Course"
          minHeight="400px"
        />
      </ContentLayout>
    );
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const isCompleted = requiredFields.every(Boolean);
  //---------------------------------------messages---------------------------------------
  const completedMessage = `You have completed ${completedFields} out of ${totalFields} fields`;

  return (
    <ContentLayout className="space-y-6">
      {/* ------------------------- Loading State------------------------------ */}
      <div className="">
        {!chapter.isPublished && (
          <Banner
            label="This chapter is not published yet. It will not be accessible to students."
            variant="warning"
          />
        )}

        {/* ------------------------- Top Area------------------------------ */}
        <div className="flex items-center  justify-between">
          <div className="w-full">
            {/* ------------------------- back button----------------------- */}
            <Link
              href={`/dashboard/course/edit/${params.courseId}`}
              className="flex items-center text-sm w-fit  transition mb-6 hover:opacity-70"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            {/* header */}
            <div className="flex flex-col  gap-y-2 justify-between">
              <h1 className="text-2xl font-bold">{chapter.title}</h1>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {completedMessage}
              </span>
            </div>
          </div>
          <ChapterActions
            disabled={!isCompleted}
            courseId={params.courseId}
            chapterId={params.chapterId}
            isPublished={chapter.isPublished}
          />
        </div>

        {/* ------------------------- Main Content------------------------------ */}

        <div className="grid grid-cols-1 pb-10 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              {/* CHapter Title */}
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} variant={"primary"} />
                <h2 className="text-xl font-semibold">Chapter Details</h2>
              </div>

              {/* chapter title form */}
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
              />

              {/* editor */}
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={params.courseId}
              />
            </div>

            <div className="flex items-center gap-x-2">
              <IconBadge icon={PenBox} variant={"primary"} />
              <h2 className="text-xl font-semibold">Chapter Assignment</h2>
            </div>
            
            {/* Chapter Assignment Component */}
            <ChapterAssignment
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} variant={"primary"} />
              <h2 className="text-xl font-semibold">Add a Video </h2>
            </div>
            {/* editor */}
            <ChapterVideoForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default ChapterPageWrapper;
