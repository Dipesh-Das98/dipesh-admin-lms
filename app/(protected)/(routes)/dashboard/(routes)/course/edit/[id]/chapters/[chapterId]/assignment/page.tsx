import React from "react";
import ChapterAssignmentWrapper from "./components/chapter-assignment-wrapper";

interface AssignmentPageProps {
  params: Promise<{
    id: string;
    chapterId: string;
  }>;
}

const AssignmentPage: React.FC<AssignmentPageProps> = async ({ params }) => {
  const { id:courseId, chapterId } = await params;
  return (
    <ChapterAssignmentWrapper params={{ courseId: courseId, chapterId }} />
  );
};

export default AssignmentPage;
