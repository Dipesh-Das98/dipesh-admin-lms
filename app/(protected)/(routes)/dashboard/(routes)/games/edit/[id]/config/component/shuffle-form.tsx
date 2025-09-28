"use client";

import { Game } from "@/types";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Save, Loader2, Edit, X } from "lucide-react";
import { updateGamesConfig } from "@/actions/dashboard/game/update-game-config";
import { useRouter } from "next/navigation";

interface GameConfigProps {
  initialData?: Game;
}

const formSchema = z.object({
  shuffleQuestions: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const parseGameConfig = (gameConfig: unknown) => {
  if (!gameConfig) return null;

  try {
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

const ShuffleForm = ({ initialData }: GameConfigProps) => {
  const queryClient = useQueryClient();
  const router=useRouter()

  const [isEditing, setIsEditing] = useState(false);

  const config = parseGameConfig(initialData?.gameConfig);
  const questionsCount = config?.questions?.length ?? 0;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shuffleQuestions: config?.shuffleQuestions ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!initialData?.id) throw new Error("Game ID is required");

      const updatedConfig = {
        shuffleQuestions: data.shuffleQuestions,
      };

      return await updateGamesConfig({
        id: initialData.id,
        gameConfig: updatedConfig,
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Shuffle configuration updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["games"] });
        queryClient.invalidateQueries({ queryKey: ["game", initialData?.id] });
        // Exit editing mode after successful save
        router.refresh()
        setIsEditing(false);
      } else {
        toast.error(result.message || "Failed to update shuffle configuration");
      }
    },
    onError: (error) => {
      console.error("Error updating shuffle configuration:", error);
      toast.error("Failed to update shuffle configuration");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to original values
    form.reset({
      shuffleQuestions: config?.shuffleQuestions ?? false,
    });
    setIsEditing(false);
  };

  const isSubmitting = mutation.isPending;

  const renderReadOnlyView = () => (
    <CardContent className="space-y-4">
      {/* Shuffle Questions Status */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2">
          <Shuffle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Shuffle Questions</span>
        </div>
        <Badge variant={config?.shuffleQuestions ? "default" : "secondary"}>
          {config?.shuffleQuestions ? "Enabled" : "Disabled"}
        </Badge>
      </div>

      {/* Questions Count Info */}
      <div className="text-sm text-muted-foreground">
        {questionsCount > 0 ? (
          <p>
            Currently {questionsCount}{" "}
            {questionsCount === 1 ? "question" : "questions"} configured
          </p>
        ) : (
          <p>
            No questions configured yet. Add questions to enable shuffle
            functionality.
          </p>
        )}
      </div>
    </CardContent>
  );

  // Editable form view
  const renderEditView = () => (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="shuffleQuestions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Shuffle Questions
                  </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    Randomize the order of questions when the game starts.
                    {questionsCount > 0 && (
                      <span className="block text-xs mt-1">
                        Currently {questionsCount}{" "}
                        {questionsCount === 1 ? "question" : "questions"}{" "}
                        configured
                      </span>
                    )}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    aria-label="Toggle shuffle questions"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {questionsCount === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4 bg-muted/50 rounded-lg">
              <p>No questions configured yet.</p>
              <p className="text-xs mt-1">
                Add questions to enable shuffle functionality.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-blue-600" />
          Shuffle Configuration
        </CardTitle>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-8 px-3"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
      </CardHeader>

      {isEditing ? renderEditView() : renderReadOnlyView()}
    </Card>
  );
};

export default ShuffleForm;
