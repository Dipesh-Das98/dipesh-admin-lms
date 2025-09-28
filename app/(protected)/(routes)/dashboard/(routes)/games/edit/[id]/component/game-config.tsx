"use client";

import { Game } from "@/types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Shuffle, ListOrdered, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface GameConfigProps {
  game: Game;
}

// Helper function to safely parse gameConfig
const parseGameConfig = (gameConfig: unknown) => {
  if (!gameConfig) return null;

  try {
    // If it's already an object, return it
    if (typeof gameConfig === "object") {
      return gameConfig as {
        shuffleQuestions?: boolean;
        questions?: unknown[];
      };
    }

    // If it's a string, parse it
    if (typeof gameConfig === "string") {
      return JSON.parse(gameConfig) as {
        shuffleQuestions?: boolean;
        questions?: unknown[];
      };
    }

    return null;
  } catch {
    return null;
  }
};

const GameConfig = ({ game }: GameConfigProps) => {
  const router = useRouter();

  const config = parseGameConfig(game.gameConfig);
  const shuffleQuestions = config?.shuffleQuestions ?? false;
  const questionsCount = config?.questions?.length ?? 0;

  const handleEditConfig = () => {
    router.push(
      `/dashboard/games/edit/${game.id}/config?category=${
        game.category?.name || ""
      }`
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Game Configuration
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditConfig}
          className="h-8 px-3"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Shuffle Questions */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Shuffle Questions</span>
          </div>
          <Badge variant={shuffleQuestions ? "default" : "secondary"}>
            {shuffleQuestions ? "Enabled" : "Disabled"}
          </Badge>
        </div>

        {/* Number of Questions */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total Questions</span>
          </div>
          <Badge variant="outline">
            {questionsCount} {questionsCount === 1 ? "Question" : "Questions"}
          </Badge>
        </div>

        {/* Additional Info */}
        {questionsCount === 0 && (
          <div className="text-sm text-muted-foreground text-center py-2">
            No questions configured yet. Click edit to add questions.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameConfig;
