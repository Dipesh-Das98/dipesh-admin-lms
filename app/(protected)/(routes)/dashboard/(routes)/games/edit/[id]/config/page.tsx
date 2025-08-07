"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DashboardPageHeader from "@/components/dashboard-panel/dashboard-page-header";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import ShuffleForm from "./component/shuffle-form";
import { useGame } from "@/hooks/use-game";
import { LoadingState, ErrorState } from "@/components/ui/states";
import QuestionManager from "../component/questions-manager";

const GameConfigPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id as string;
  const category = searchParams.get("category");

  const {
    data: gameResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGame(id);

  // Loading state
  if (isLoading) {
    return (
      <ContentLayout className="space-y-8">
        <LoadingState
          message="Loading game configuration..."
          minHeight="400px"
        />
      </ContentLayout>
    );
  }

  // Error state
  if (isError || !gameResponse?.success || !gameResponse?.data) {
    const errorMessage =
      gameResponse?.message ||
      error?.message ||
      "Unable to load game configuration. Please try again.";

    return (
      <ContentLayout className="space-y-8">
        <ErrorState
          title="Failed to Load Game"
          message={errorMessage}
          onRetry={() => refetch()}
          retryText="Try Again"
          minHeight="400px"
        />
      </ContentLayout>
    );
  }

  const game = gameResponse.data;

  return (
    <ContentLayout className="space-y-8">
      <DashboardPageHeader
        title={`${game.title} - Configuration`}
        href={`/dashboard/games/edit/${id}`}
        type="game"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ShuffleForm initialData={game} />
        </div>

        <div className="space-y-6">
           <QuestionManager game={game} category={category!} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default GameConfigPage;
