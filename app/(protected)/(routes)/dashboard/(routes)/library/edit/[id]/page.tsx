import { getCategoryByType } from "@/actions/dashboard/category/get-category";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import React from "react";
import { BasicSettingsForm } from "./components/basic-settings-form";
import { MediaForm } from "./components/media-upload-form";
import DashboardPageHeader from "@/components/dashboard-panel/dashboard-page-header";
import { getLibraryById } from "@/actions/dashboard/library";
import { LibraryThumbnailForm } from "./components/library-thumbnail-form";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditPage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const [library, category] = await Promise.all([
    getLibraryById(id),
    getCategoryByType("library"),
  ]);

  if (!library.data || !library.success) {
    return (
      <ContentLayout>
        <h1 className="text-3xl font-bold">Library Not Found</h1>
        <p className="text-muted-foreground">
            {library.message || `The library with ID: ${id} does not exist or has been deleted.`}
        </p>
      </ContentLayout>
    );
  }
  return (
    <ContentLayout>
      {/* Header with back button */}
      <DashboardPageHeader
        title={library.data.title}
        href="/dashboard/library"
        type="library"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Left Column: Story Form */}
        <div className="space-y-8">
          <BasicSettingsForm categories={category} library={library.data!} />
        </div>

        {/* Right Column: Media Forms */}
        <div className="space-y-8">
          <LibraryThumbnailForm library={library.data!} />
          <MediaForm library={library.data!} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default EditPage;
