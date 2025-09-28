"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateGames,
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
import { Textarea } from "@/components/ui/textarea";
import { CustomColorPicker } from "@/components/ui/custom-color-picker";
import { Game } from "@/types/game.type";
import { Language } from "@/config/forms/child-form-options";
import { languageOptions } from "@/config/forms/common-form-options";

import { BookOpen, Save, Loader2 } from "lucide-react";
import FormItemInfo from "@/components/ui/form-label";
import { Category } from "@/types";
const basicSettingsSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  backgroundColor: z.string().min(1, "Background color is required"),
  language: z.nativeEnum(Language, {
    required_error: "Language is required",
  }),
  instructions: z
    .string()
    .max(1000, "Instructions must be less than 1000 characters")
    .optional(),
  categoryId: z.string().min(1, "Category is required"),
  timePerLevel: z
    .number()
    .min(1, "Time per level must be at least 1 second")
    .max(3600, "Time per level must be less than 1 hour"),
});

type BasicSettingsFormData = z.infer<typeof basicSettingsSchema>;

interface BasicSettingsFormProps {
  game?: Game;
  categories: Category[];
}

export function BasicSettingsForm({
  game,
  categories,
}: BasicSettingsFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<BasicSettingsFormData>({
    resolver: zodResolver(basicSettingsSchema),
    defaultValues: {
      title: game?.title || "",
      description: game?.description || "",
      backgroundColor: game?.backgroundColor || "#6E56CF",
      language: game?.language || Language.ENGLISH,
      instructions: game?.instructions || "",
      categoryId: game?.categoryId || "",
      timePerLevel: game?.timePerLevel || 60,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: BasicSettingsFormData) => {
      if (!game?.id) throw new Error("Game ID is required");

      const updateData: UpdateGamesData = {
        id: game.id,
        ...data,
      };

      return await updateGames(updateData);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Game settings updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["games"] });
      } else {
        toast.error(result.message || "Failed to update game settings");
      }
    },
    onError: (error) => {
      console.error("Error updating game:", error);
      toast.error("Failed to update game settings");
    },
  });

  const onSubmit = (data: BasicSettingsFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Basic Settings</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Game Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter game title"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormItemInfo message="A clear and engaging title for your game" />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language Field */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Language <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={mutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 w-full border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languageOptions.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormItemInfo message="The primary language of the game content" />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={mutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 w-full border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-border/50">
                      {" "}
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="focus:bg-primary/10"
                        >
                          <div className="flex flex-col">
                            <span>{category.name}</span>
                            {category.description && (
                              <span className="text-xs text-muted-foreground">
                                {category.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormItemInfo message="🕹️ Choose the category that best fits your game" />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Per Level Field */}
            <FormField
              control={form.control}
              name="timePerLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Time Per Level (seconds){" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="60"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormItemInfo message="⌛ Time limit for each game level in seconds" />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a detailed description of your game"
                    className="min-h-[100px]"
                    {...field}
                    disabled={mutation.isPending}
                  />
                </FormControl>
                <FormItemInfo message="Provide a comprehensive description of the game" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Instructions Field */}
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter game instructions for players"
                    className="min-h-[80px]"
                    {...field}
                    disabled={mutation.isPending}
                  />
                </FormControl>
                <FormItemInfo message="Clear instructions on how to play the game" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Background Color Field */}
          <FormField
            control={form.control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Background Color <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <CustomColorPicker
                    name="backgroundColor"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={mutation.isPending}
                  />
                </FormControl>
                <FormItemInfo message="Choose a background color for your game interface" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={mutation.isPending}
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
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
