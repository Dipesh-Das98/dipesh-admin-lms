import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ChapterPageWrapper from "./components/chapter-page-wrapper";

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{
    id: string;
    chapterId: string;
  }>;
}) => {
  const session = await auth();
  // Redirect if not logged in
  if (!session?.user) {
    return redirect("/");
  }
  const { id: courseId, chapterId } = await params;

  return <ChapterPageWrapper params={{ courseId, chapterId }} />;
};

export default ChapterIdPage;
