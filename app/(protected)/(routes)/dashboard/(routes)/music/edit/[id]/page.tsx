import { getCategoryByType } from "@/actions/dashboard/category/get-category";
import { getMusicById } from "@/actions/dashboard/music/get-music";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DashboardPageHeader from "@/components/dashboard-panel/dashboard-page-header";

import { BasicSettingsForm } from "./components/basic-settings-form";
import { MediaForm } from "./components/media-upload-form";
import { MusicThumbnailForm } from "@/app/(protected)/(routes)/dashboard/(routes)/music/edit/[id]/components/music-thumbnail-form";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditPage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const [music, category] = await Promise.all([
    getMusicById(id),
    getCategoryByType("music"),
  ]);

  if (!music.data || !music.success) {
    return (
      <ContentLayout>
        <h1 className="text-3xl font-bold">Music Not Found</h1>
        <p className="text-muted-foreground">
          The music with ID: {id} does not exist or has been deleted.
        </p>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      {/* Header with back button */}
      <DashboardPageHeader
        title={music.data.title}
        href="/dashboard/music"
        type="music"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Left Column: Music Form */}
        <div className="space-y-8">
          <BasicSettingsForm categories={category} music={music.data!} />
        </div>

        {/* Right Column: Media Forms */}
        <div className="space-y-8">
          <MusicThumbnailForm music={music.data!} />
          <MediaForm music={music.data!} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default EditPage;
