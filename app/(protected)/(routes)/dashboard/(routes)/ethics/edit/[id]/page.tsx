import { getEthicsById } from "@/actions/dashboard/ethics/get-ethic";
import { getCategoryByType } from "@/actions/dashboard/category/get-category";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DashboardPageHeader from "@/components/dashboard-panel/dashboard-page-header";

import { BasicSettingsForm } from "./components/basic-settings-form";
import { MediaForm } from "./components/media-upload-form";
import { EthicsThumbnailForm } from "@/app/(protected)/(routes)/dashboard/(routes)/ethics/edit/[id]/components/ethics-thumbnail-form";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditPage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const [ethics, category] = await Promise.all([
    getEthicsById(id),
    getCategoryByType("ethics"),
  ]);

  if (!ethics.data || !ethics.success) {
    return (
      <ContentLayout>
        <h1 className="text-3xl font-bold">Ethics Not Found</h1>
        <p className="text-muted-foreground">
          The ethics with ID: {id} does not exist or has been deleted.
        </p>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      {/* Header with back button */}
      <DashboardPageHeader
        title={ethics.data.title}
        href="/dashboard/ethics"
        type="ethics"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Left Column: Ethics Form */}
        <div className="space-y-8">
          <BasicSettingsForm categories={category} ethics={ethics.data!} />
        </div>

        {/* Right Column: Media Forms */}
        <div className="space-y-8">
          <EthicsThumbnailForm ethics={ethics.data!} />
          <MediaForm ethics={ethics.data!} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default EditPage;
