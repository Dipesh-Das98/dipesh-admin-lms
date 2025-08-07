"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createGame } from "@/actions/dashboard/game/create-game";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { useSheet } from "@/hooks/use-sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Language } from "@/config/forms/child-form-options";
import { GameCategory } from "@/types/game.type";
import { getCategoryByType } from "@/actions/dashboard/category/get-category";
import { Loader } from "lucide-react";

// Form schemas
const createGameSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  language: z.nativeEnum(Language, {
    required_error: "Language is required",
  }),
  categoryId: z.string().min(1, "Category is required"),
});

type GameFormData = z.infer<typeof createGameSchema>;

// Sheet content component that will be used by the provider
export function GameFormContent() {
  const queryClient = useQueryClient();
  const { isOpen, onClose, type } = useSheet();

  const isGameFormOpen = isOpen && type === "game-form";

  // Fetch categories
  const { data: categories = [] } = useQuery<GameCategory[]>({
    queryKey: ["categories", "game"],
    queryFn: () => getCategoryByType("game"),
    enabled: isGameFormOpen,
  });

  const form = useForm<GameFormData>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      title: "",
      description: "",
      language: Language.ENGLISH,
      categoryId: "",
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createGame,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate and refetch games queries
        queryClient.invalidateQueries({ queryKey: ["games"] });
        onClose();
        toast.success("Redirecting to edit page...");
        // Redirect to edit page with new game ID
        setTimeout(() => {
          window.location.href = `/dashboard/games/edit/${response.data?.id}`;
        }, 1000);
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Create game error:", error);
      toast.error("Failed to create game. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending;

  // Reset form when sheet opens
  React.useEffect(() => {
    if (isGameFormOpen) {
      form.reset({
        title: "",
        description: "",
        language: Language.ENGLISH,
        categoryId: "",
      });
    }
  }, [isGameFormOpen, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
      // Reset form when closing
      form.reset({
        title: "",
        description: "",
        language: Language.ENGLISH,
        categoryId: "",
      });
    }
  };

  const onSubmit = async (data: GameFormData) => {
    createMutation.mutate(data);
  };

  return (
    <Sheet open={isGameFormOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader>
          <SheetTitle>Create New Game</SheetTitle>
          <SheetDescription>
            Fill in the details below to create a new game.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter game title"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter game description"
                        disabled={isSubmitting}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Language).map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="gap-2">
              <SheetClose asChild>
                <Button variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader className="mr-2 animate-spin" />}
                {isSubmitting ? "Creating..." : "Create Game"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
