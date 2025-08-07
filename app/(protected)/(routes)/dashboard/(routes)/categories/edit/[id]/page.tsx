import { getCategoryById } from "@/actions/dashboard/category/get-category-by-id";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DashboardPageHeader from "@/components/dashboard-panel/dashboard-page-header";
import { BasicSettingsForm } from "./components/basic-settings-form";
import { CategoryThumbnailForm } from "./components/category-thumbnail-form";
import { CategoryMediaForm } from "./components/media-upload-form";
//import { CategoryThumbnailForm } from "./components/category-thumbnail-form";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditPage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category.data || !category.success) {
    return (
      <ContentLayout>
        <h1 className="text-3xl font-bold">Category Not Found</h1>
        <p className="text-muted-foreground">
          {category.message || `The category with ID: ${id} does not exist or has been deleted.`}
        </p>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      {/* Header with back button */}
      <DashboardPageHeader
        title={category.data.name}
        href="/dashboard/categories"
        type="category"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Left Column: Category Form */}
        <div className="space-y-8">
          <BasicSettingsForm category={category.data} />
        </div>

        {/* Right Column: Media Forms */}
        <div className="space-y-8">
          <CategoryThumbnailForm category={category.data} />
          <CategoryMediaForm category={category.data} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default EditPage;
