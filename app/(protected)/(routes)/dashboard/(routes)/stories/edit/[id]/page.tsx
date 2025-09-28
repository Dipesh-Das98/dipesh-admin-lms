import { getCategoryByType } from "@/actions/dashboard/category/get-category";
import { getStory } from "@/actions/dashboard/story/get-story";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import React from "react";
import { BasicSettingsForm } from "./components/basic-settings-form";
import { MediaForm } from "./components/media-upload-form";
import { StoryThumbnailForm } from "./components/story-thumbnail-form";
import DashboardPageHeader from "@/components/dashboard-panel/dashboard-page-header";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditPage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const [story, category] = await Promise.all([
    getStory(id),
    getCategoryByType("story"),
  ]);

  if (!story.data || !story.success) {
    return (
      <ContentLayout>
        <h1 className="text-3xl font-bold">Story Not Found</h1>
        <p className="text-muted-foreground">
            {story.message || `The story with ID: ${id} does not exist or has been deleted.`}
        </p>
      </ContentLayout>
    );
  }
  return (
    <ContentLayout>
      {/* Header with back button */}
      <DashboardPageHeader
        title={story.data.title}
        href="/dashboard/stories"
        type="story"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Left Column: Story Form */}
        <div className="space-y-8">
          <BasicSettingsForm categories={category} story={story.data!} />
        </div>

        {/* Right Column: Media Forms */}
        <div className="space-y-8">
          <StoryThumbnailForm story={story.data!} />
          <MediaForm story={story.data!} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default EditPage;
