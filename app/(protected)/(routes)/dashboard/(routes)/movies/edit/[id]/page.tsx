import { getCategoryByType } from "@/actions/dashboard/category/get-category";
import { getMovieById } from "@/actions/dashboard/movie/get-movie";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { BasicSettingsForm } from "./components/basic-settings-form";
import { MediaForm } from "./components/media-upload-form";
import { MovieThumbnailForm } from "./components/movie-thumbnail-form";
import DashboardPageHeader from "@/components/dashboard-panel/dashboard-page-header";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditPage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const [movie, category] = await Promise.all([
    getMovieById(id),
    getCategoryByType("movie"),
  ]);

  if (!movie.data || !movie.success) {
    return (
      <ContentLayout>
        <h1 className="text-3xl font-bold">Movie Not Found</h1>
        <p className="text-muted-foreground">
          The movie with ID: {id} does not exist or has been deleted.
        </p>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <DashboardPageHeader title={movie.data.title} href="/dashboard/movies" type="movie" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Left Column: Movie Form */}
        <div className="space-y-8">
          <BasicSettingsForm categories={category} movie={movie.data!} />
        </div>

        {/* Right Column: Media Forms */}
        <div className="space-y-8">
          <MovieThumbnailForm movie={movie.data!} />
          <MediaForm movie={movie.data!} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default EditPage;
