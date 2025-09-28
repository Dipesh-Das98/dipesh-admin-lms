import { notFound } from "next/navigation";

import { getCategoryByType } from "@/actions/dashboard/category/get-category";
import { getGameById } from "@/actions/dashboard/game/get-game-by-id";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { BasicSettingsForm } from "./component/basic-settings-form";
import { GameThumbnailForm } from "./component/game-thumbnail-form";
import GameConfig from "./component/game-config";
import DashboardPageHeader from "@/components/dashboard-panel/dashboard-page-header";

interface GamesEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const GamesEditPage = async ({ params }: GamesEditPageProps) => {
  const { id } = await params;

  // Fetch game data and categories in parallel
  const [gameResponse, categories] = await Promise.all([
    getGameById(id),
    getCategoryByType("game"),
  ]);

  if (!gameResponse.success || !gameResponse.data) {
    notFound();
  }

  const game = gameResponse.data;

  return (
    <ContentLayout className="space-y-8">
      {/* Header with back button */}
      <DashboardPageHeader
        title={game.title}
        href="/dashboard/games"
        type="game"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BasicSettingsForm game={game} categories={categories} />
        </div>

        <div className="space-y-6">
          <GameThumbnailForm game={game} />
          <GameConfig game={game} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default GamesEditPage;
