import { getLanguageCornerById } from "@/actions/dashboard/language/get-language";
import { getCategoryByType } from "@/actions/dashboard/category/get-category";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DashboardPageHeader from "@/components/dashboard-panel/dashboard-page-header";

import { BasicSettingsForm } from "./components/basic-settings-form";
import { MediaForm } from "./components/media-upload-form";
import { LanguageCornerThumbnailForm } from "./components/language-thumbnail-form";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditPage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const [languageCorner, category] = await Promise.all([
    getLanguageCornerById(id),
    getCategoryByType("language_corner"),
  ]);

  if (!languageCorner.data || !languageCorner.success) {
    return (
      <ContentLayout>
        <h1 className="text-3xl font-bold">Language Corner Content Not Found</h1>
        <p className="text-muted-foreground">
          The language corner content with ID: {id} does not exist or has been deleted.
        </p>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      {/* Header with back button */}
      <DashboardPageHeader
        title={languageCorner.data.title}
        href="/dashboard/language"
        type="language"
      />

      <div className="grid grid-cols-1 w-full lg:grid-cols-2 gap-8 mt-6">
        {/* Left Column: Language Corner Form */}
        <div className="space-y-8">
          <BasicSettingsForm categories={category} languageCorner={languageCorner.data!} />
        </div>

        {/* Right Column: Media Forms */}
        <div className="space-y-8">
          <LanguageCornerThumbnailForm languageCorner={languageCorner.data!} />
          <MediaForm languageCorner={languageCorner.data!} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default EditPage;
