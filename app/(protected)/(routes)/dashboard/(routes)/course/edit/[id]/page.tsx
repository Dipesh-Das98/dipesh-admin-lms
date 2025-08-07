import React from "react";
import EditPageWrapper from "../components/edit-page-wrapper";

interface CourseEditPageProps {
  params: Promise<{
    id: string;
  }>;
}
const CourseEditPage = async ({ params }: CourseEditPageProps) => {
  const { id } = await params;
  return <EditPageWrapper courseId={id} />;
};

export default CourseEditPage;
