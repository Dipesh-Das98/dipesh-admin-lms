"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useModal } from "@/hooks/use-modal";
import {
  UpdateGamesData,
} from "@/actions/dashboard/game/update-game";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Game } from "@/types/game.type";
import {
  GameQuestionSchema,
  GameQuestion,
  GameDifficultyEnum,
  GameQuestionTypeEnum,
} from "@/config/forms/game-from-options";

import {
  BookOpen,
  Save,
  Loader2,
  Plus,
  Trash2,
  ImageIcon,
  Volume2,
  FileText,
  HelpCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Image from "next/image";
import {  placeholderBlurhash } from "@/lib/utils";
import { updateGamesConfig } from "@/actions/dashboard/game/update-game-config";

// Define the form schema with proper typing
const QuestionsFormSchema = z.object({
  questions: z.array(GameQuestionSchema),
});

type QuestionsFormData = z.infer<typeof QuestionsFormSchema>;

interface QuestionManagerProps {
  game: Game;
  category: string;
}

const QuestionManager = ({ game, category }: QuestionManagerProps) => {
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  // Check if category is ANIMALS to hide quiz-specific fields
  const isAnimalsCategory = category.toUpperCase() === "ANIMALS";

  // Parse existing questions from game config
  const getExistingQuestions = (): GameQuestion[] => {
    try {
      if (game.gameConfig && typeof game.gameConfig === "object") {
        const config = game.gameConfig as { questions?: GameQuestion[] };
        return config.questions || [];
      }
      return [];
    } catch {
      return [];
    }
  };

  const form = useForm<QuestionsFormData>({
    resolver: zodResolver(QuestionsFormSchema),
    defaultValues: {
      questions: getExistingQuestions(),
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const mutation = useMutation({
    mutationFn: async (data: QuestionsFormData) => {
      if (!game?.id) throw new Error("Game ID is required");

      console.log("Updating questions for game:", data);
      // Get current game config and update only the questions
      const currentConfig = game.gameConfig || {};
      const updatedConfig = {
        ...currentConfig,
        questions: data.questions,
      };

      const updateData: UpdateGamesData = {
        id: game.id,
        gameConfig: updatedConfig,
      };

      return await updateGamesConfig(updateData);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Questions updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["games"] });
      } else {
        toast.error(result.message || "Failed to update questions");
      }
    },
    onError: (error) => {
      console.error("Error updating questions:", error);
      toast.error("Failed to update questions");
    },
  });

  const addNewQuestion = () => {
    const newQuestion: GameQuestion = {
      id: `question_${Date.now()}`,
      difficulty: "easy",
      type: isAnimalsCategory ? "image" : "quiz",
      order_no: fields.length + 1,
      thumbnail: "",
      mediaUrl: "",
      feedback: "",
      hint: "",
      // Only add quiz fields if not ANIMALS category
      ...(isAnimalsCategory
        ? {}
        : {
            questionText: "",
            options: ["", "", "", ""],
            answer: "",
          }),
    };
    append(newQuestion);
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    if (toIndex >= 0 && toIndex < fields.length) {
      move(fromIndex, toIndex);
      // Update order numbers
      const questions = form.getValues("questions");
      console.log("Moving question from", fromIndex, "to", toIndex);
      console.log("Current questions:", questions);
      questions.forEach((question, index) => {
        form.setValue(`questions.${index}.order_no`, index + 1);
      });
    }
  };

  const onSubmit = (data: QuestionsFormData) => {
    // Update order numbers before submitting
    const questionsWithOrder = data.questions.map((question, index) => ({
      ...question,
      order_no: index + 1,
    }));

    mutation.mutate({ questions: questionsWithOrder });
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "audio":
        return <Volume2 className="w-4 h-4" />;
      case "text":
        return <FileText className="w-4 h-4" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Question Manager</h2>
          <Badge variant="outline" className="ml-2">
            {fields.length} {fields.length === 1 ? "Question" : "Questions"}
          </Badge>
        </div>

        {category && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Category:</span>
            <Badge variant={isAnimalsCategory ? "destructive" : "default"}>
              {category.toUpperCase()}
            </Badge>
            {isAnimalsCategory && (
              <span className="text-xs text-muted-foreground">
                (Quiz fields disabled)
              </span>
            )}
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Question List */}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="border relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {/* Question Header */}
                    <CardTitle className="text-base flex items-center gap-2">
                      {getQuestionTypeIcon(
                        form.watch(`questions.${index}.type`)
                      )}
                      Question {index + 1}
                      <Badge variant="outline" className="ml-2">
                        {form.watch(`questions.${index}.difficulty`)}
                      </Badge>
                    </CardTitle>
                    {/* move funtion */}

                    <div className="flex items-center gap-2">
                      {/* Move up/down buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveQuestion(index, index - 1)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveQuestion(index, index + 1)}
                          disabled={index === fields.length - 1}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Question Fields */}
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 items-center justify-center md:grid-cols-2 gap-4">
                    {/* Question Type */}
                    <FormField
                      control={form.control}
                      name={`questions.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={mutation.isPending || isAnimalsCategory}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GameQuestionTypeEnum.options.map((type) => (
                                <SelectItem key={type} value={type}>
                                  <div className="flex items-center gap-2">
                                    {getQuestionTypeIcon(type)}
                                    {type.charAt(0).toUpperCase() +
                                      type.slice(1)}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Difficulty Level */}
                    <FormField
                      control={form.control}
                      name={`questions.${index}.difficulty`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GameDifficultyEnum.options.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level.charAt(0).toUpperCase() +
                                    level.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>{" "}
                  {/* Thumbnail/Image URL */}
                  <FormField
                    control={form.control}
                    name={`questions.${index}.thumbnail`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail/Image URL</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              placeholder="Enter image URL or upload media"
                              disabled={mutation.isPending}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                openModal("media-uplaod-model", {
                                  handleUpdate: (
                                    uploadedFiles?: Array<{
                                      key: string;
                                      url: string;
                                      name: string;
                                      originalName: string;
                                      size: number;
                                      category: string;
                                    }>
                                  ) => {
                                    if (
                                      uploadedFiles &&
                                      uploadedFiles.length > 0
                                    ) {
                                      // Use the first uploaded file's URL
                                      const fileUrl = uploadedFiles[0].url;
                                      form.setValue(
                                        `questions.${index}.thumbnail`,
                                        fileUrl
                                      );
                                      toast.success("Thumbnail updated!");
                                    }
                                  },
                                });
                              }}
                              disabled={mutation.isPending}
                            >
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        {field.value && (
                          <div className="mt-2 relative aspect-square h-40">
                            <Image
                              fill
                              blurDataURL={placeholderBlurhash}
                              placeholder="blur"
                              sizes="(max-width: 20px) 20px, 100vw"
                              src={field.value}
                              alt="Question thumbnail"
                              className="w-20 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Question Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={addNewQuestion}
              disabled={mutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Question
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={mutation.isPending || fields.length === 0}
              className="min-w-[120px]"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Questions
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuestionManager;
