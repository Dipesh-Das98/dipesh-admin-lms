"use client";

import React, { FC } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { languageSchema } from "@/schema";
import { updateCourse } from "@/actions/dashboard/course/update-course";
import { Course } from "@/types";
import { languageOptions } from "@/config/forms/common-form-options";

interface LanguageFormProps {
  initialData: Course;
  courseId: string;
}

const LanguageForm: FC<LanguageFormProps> = ({ initialData, courseId }) => {
  // ---------------------------------------hooks---------------------------------------
  const form = useForm<z.infer<typeof languageSchema>>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: initialData.language || "",
    },
  });

  const queryClient = useQueryClient();

  // ---------------------------------------state---------------------------------------
  const { isValid } = form.formState;
  const [isEditing, setIsEditing] = React.useState(false);

  // ---------------------------------------mutations---------------------------------------
  const updateMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Course language updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        setIsEditing(false);
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update course error:", error);
      toast.error("Failed to update course language. Please try again.");
    },
  });

  // ---------------------------------------handlers---------------------------------------
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      form.reset({ language: initialData.language || "" });
    }
  };

  const handleSubmit = (data: z.infer<typeof languageSchema>) => {
    updateMutation.mutate({
      id: courseId,
      language: data.language,
    });
  };

  const selectedLanguage = languageOptions.find(lang => lang.value === initialData.language);

  return (
    <div className="mt-6 bg-slate-100 dark:bg-neutral-800 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Language
        <Button onClick={toggleEdit} variant="ghost" size="sm">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Language
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className={`text-sm mt-2 ${!selectedLanguage && "text-slate-500 italic"}`}>
          {selectedLanguage?.label || "No language selected"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="language"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={updateMutation.isPending}
                    >
                      <SelectTrigger className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <LoadingButton
                isLoading={updateMutation.isPending}
                type="submit"
                size="sm"
                disabled={!isValid || updateMutation.isPending}
              >
                Save
              </LoadingButton>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default LanguageForm;
