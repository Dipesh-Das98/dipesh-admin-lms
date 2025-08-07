"use client";

import React from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import CourseActions from "./course-action";
import { IconBadge } from "@/components/ui/icon-badge";
import TitleForm from "./title-form";
import DescriptionForm from "./description-form";
import ImageUploadForm from "./image-upload-form";
import CategoryForm from "./category-form";
import GradeForm from "./grade-form";
import LanguageForm from "./language-form";
import BackgroundColorForm from "./background-color-form";
import { CheckCircleIcon, LayoutDashboard, NotebookPen } from "lucide-react";
import { useCourse } from "@/hooks/use-course";
import { LoadingState, ErrorState } from "@/components/ui/states";
import ChaptersForm from "./chapters-form";

interface EditPageWrapperProps {
  courseId: string;
}

const EditPageWrapper: React.FC<EditPageWrapperProps> = ({ courseId }) => {
  // Fetch course data using TanStack Query
  const {
    data: courseResponse,
    isLoading: courseLoading,
    isError: courseError,
    error: courseErrorData,
    refetch: refetchCourse,
  } = useCourse(courseId);

  // Loading state
  if (courseLoading) {
    return (
      <ContentLayout className="space-y-6">
        <LoadingState message="Loading course data..." minHeight="400px" />
      </ContentLayout>
    );
  }

  // Error state
  if (courseError || !courseResponse?.success || !courseResponse?.data) {
    const errorMessage =
      courseResponse?.message ||
      courseErrorData?.message ||
      "Unable to load course data. Please try again.";

    return (
      <ContentLayout className="space-y-6">
        <ErrorState
          title="Failed to Load Course"
          message={errorMessage}
          onRetry={() => {
            refetchCourse();
          }}
          retryText="Try Again"
          minHeight="400px"
        />
      </ContentLayout>
    );
  }

  const course = courseResponse.data;

  const requiredFields = [
    course?.title,
    course?.categoryId,
    course?.grade,
    course?.language,
    course?.thumbnail,
    course?.backgroundColor,
    course?.description,
    course?.chapters?.some((chapter) => chapter.isPublished === true),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const isComplete = requiredFields.every(Boolean);
  const completionText = ` ${completedFields}/${totalFields}`;

  return (
    <ContentLayout
      className="space-y-6"
      breadcrumbItems={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Course Management",
          href: "/dashboard/course",
        },
        {
          label: course?.title || "Edit Course",
          href: `/dashboard/course/edit/${courseId}`,
        },
      ]}
    >
      <div className="flex items-center justify-between mb-8">
        {/* ----------------header------------------ */}
        <div className="flex flex-col gap-y-3">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700 dark:text-muted-foreground">
            Complete all fields {completionText}
          </span>
        </div>
        {/* ----------------header------------------ */}
        <CourseActions
          disabled={!isComplete}
          courseId={course.id}
          isPublished={course.isPublished}
        />
      </div>

      {/* ------------form section------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-12">
        {/* Course Setup - Left Column */}
        <div className="order-1 space-y-6">
          <div className="flex items-center gap-x-2 mb-4">
            <IconBadge icon={LayoutDashboard}/>
            <h2 className="text-xl font-semibold">Customize Your Course</h2>
          </div>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                Basic Information
              </h3>
              <TitleForm initialData={course} courseId={courseId} />
              <DescriptionForm initialData={course} courseId={courseId} />
              <ImageUploadForm initialData={course} courseId={courseId} />
            </div>

            {/* Course Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                Course Details
              </h3>
              <CategoryForm initialData={course} courseId={courseId} />
              <GradeForm initialData={course} courseId={courseId} />
              <LanguageForm initialData={course} courseId={courseId} />
            </div>

            {/* Appearance */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                Appearance
              </h3>
              <BackgroundColorForm initialData={course} courseId={courseId} />
            </div>
          </div>
        </div>

        {/* Course Content - Right Column */}
        <div className="order-2 space-y-6">
          {/* Course Chapters Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CheckCircleIcon} />
              <h2 className="text-xl font-semibold">Course Chapters</h2>
            </div>
            <ChaptersForm initialData={course} courseId={courseId} />
          </div>

          {/* Resources & Attachments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={NotebookPen}  />
              <h2 className="text-xl font-semibold">Resources & Attachments</h2>
            </div>
            <div className="bg-slate-100 dark:bg-neutral-800 rounded-md p-6 min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <NotebookPen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Course Resources
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Add course materials and attachments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default EditPageWrapper;
