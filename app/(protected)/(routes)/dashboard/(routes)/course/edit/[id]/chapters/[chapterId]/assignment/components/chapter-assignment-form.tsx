"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Save,
  Pencil,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Copy,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { Chapter } from "@/types";
import { updateChapterAssignment } from "@/actions/dashboard/course/chapter/update-chapter-assignment";

interface ChapterAssignmentFormProps {
  courseId: string;
  chapterId: string;
  initialData?: Chapter;
}

// Define the form data type with explicit typing
interface AssignmentFormData {
  title: string;
  description?: string;
  isPublished: boolean;
  type: "QUIZ";
  questions: {
    id: string;
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
  }[];
}

// Utility function to generate unique IDs
const generateQuestionId = () => {
  return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const ChapterAssignmentForm: React.FC<ChapterAssignmentFormProps> = ({
  courseId,
  chapterId,
  initialData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Initialize form with default data
  const form = useForm<AssignmentFormData>({
    defaultValues: {
      title: initialData?.assignments?.title || "Quiz Assignment",
      description: initialData?.assignments?.description || "",
      isPublished: initialData?.assignments?.isPublished || false,
      type: initialData?.assignments?.type || "QUIZ",
      questions: initialData?.assignments?.questions?.map((q: {
        id?: string;
        question: string;
        options: string[];
        answer: string;
        explanation?: string;
      }) => ({
        id: q.id || generateQuestionId(),
        question: q.question || "",
        options: q.options || ["", "", "", ""],
        answer: q.answer || "",
        explanation: q.explanation || "",
      })) || [
        {
          id: generateQuestionId(),
          question: "",
          options: ["", "", "", ""],
          answer: "",
          explanation: "",
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // Mutation for updating assignment
  const updateMutation = useMutation({
    mutationFn: (data: AssignmentFormData) => {
      return updateChapterAssignment(chapterId, data);
    },
    onSuccess: (response: { success: boolean; message?: string }) => {
      if (response.success) {
        toast.success("Assignment updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        setIsEditing(false);
      } else {
        toast.error(response.message || "Failed to update assignment");
      }
    },
    onError: (error: Error) => {
      console.error("Update assignment error:", error);
      toast.error("Failed to update assignment. Please try again.");
    },
  });

  const { isValid } = form.formState;

  // Handlers
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      form.reset();
    }
  };

  const handleSubmit = (data: AssignmentFormData) => {
    console.log("Submitting assignment data:", data);
    updateMutation.mutate(data);
  };

  const addQuestion = () => {
    append({
      id: generateQuestionId(),
      question: "",
      options: ["", "", "", ""],
      answer: "",
      explanation: "",
    });
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    if (toIndex >= 0 && toIndex < fields.length) {
      move(fromIndex, toIndex);
    }
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = form.getValues(`questions.${index}`);
    append({
      ...questionToDuplicate,
      id: generateQuestionId(), // Generate new ID for duplicated question
      question: `${questionToDuplicate.question} (Copy)`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Assignment Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Assignment Configuration
                <Badge variant="outline" className="ml-2">
                  {fields.length}{" "}
                  {fields.length === 1 ? "Question" : "Questions"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Configure the assignment details and quiz questions for this
                chapter.
              </CardDescription>
            </div>
            <Button onClick={toggleEdit} variant="ghost">
              {isEditing ? (
                <>Cancel</>
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Assignment
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {/* Read-only view */}
        {!isEditing && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Title
                </h4>
                <p className="text-sm">
                  {form.getValues("title") || "No title set"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Status
                </h4>
                <Badge
                  variant={
                    form.getValues("isPublished") ? "default" : "secondary"
                  }
                >
                  {form.getValues("isPublished") ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  {form.getValues("isPublished") ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            {form.getValues("description") && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Description
                </h4>
                <p className="text-sm">{form.getValues("description")}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Questions
              </h4>
              <p className="text-sm">
                {fields.length} quiz question(s) configured
              </p>
            </div>
          </CardContent>
        )}

        {/* Editable form */}
        {isEditing && (
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {/* Basic Assignment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignment Title *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter assignment title"
                            disabled={updateMutation.isPending}
                          />
                        </FormControl>
                        <FormDescription>
                          This title will be visible to students.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Publish Assignment</FormLabel>
                          <FormDescription>
                            Make this assignment visible to students.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={updateMutation.isPending}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter assignment description or instructions"
                          rows={3}
                          disabled={updateMutation.isPending}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide additional context or instructions for students.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Questions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Quiz Questions</h3>
                      <p className="text-sm text-muted-foreground">
                        Add multiple choice questions for the assignment.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addQuestion}
                      disabled={updateMutation.isPending}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>

                  {/* Empty state */}
                  {fields.length === 0 && (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <HelpCircle className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                          No questions added yet
                        </h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          Add your first question to get started with the
                          assignment.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addQuestion}
                          disabled={updateMutation.isPending}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Question
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Question Cards */}
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="relative">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <HelpCircle className="w-4 h-4" />
                              Question {index + 1}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              {/* Move buttons */}
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => moveQuestion(index, index - 1)}
                                  disabled={
                                    index === 0 || updateMutation.isPending
                                  }
                                  title="Move up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => moveQuestion(index, index + 1)}
                                  disabled={
                                    index === fields.length - 1 ||
                                    updateMutation.isPending
                                  }
                                  title="Move down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </Button>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => duplicateQuestion(index)}
                                disabled={updateMutation.isPending}
                                title="Duplicate question"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>

                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => remove(index)}
                                disabled={updateMutation.isPending}
                                title="Delete question"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Question Text */}
                          <FormField
                            control={form.control}
                            name={`questions.${index}.question`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question Text *</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Enter your question here..."
                                    rows={2}
                                    disabled={updateMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Options */}
                          <div className="space-y-3">
                            <FormLabel>Answer Options *</FormLabel>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[0, 1, 2, 3].map((optionIndex) => (
                                <FormField
                                  key={optionIndex}
                                  control={form.control}
                                  name={`questions.${index}.options.${optionIndex}`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className="flex items-center space-x-2">
                                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                            {String.fromCharCode(
                                              65 + optionIndex
                                            )}
                                          </div>
                                          <Input
                                            {...field}
                                            placeholder={`Option ${String.fromCharCode(
                                              65 + optionIndex
                                            )}`}
                                            disabled={updateMutation.isPending}
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Correct Answer */}
                          <FormField
                            control={form.control}
                            name={`questions.${index}.answer`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Correct Answer *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={updateMutation.isPending}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select the correct answer" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {form
                                      .watch(`questions.${index}.options`)
                                      ?.map((option, optionIndex) =>
                                        option && option.trim() ? (
                                          <SelectItem
                                            key={optionIndex}
                                            value={option}
                                          >
                                            {String.fromCharCode(
                                              65 + optionIndex
                                            )}{" "}
                                            - {option}
                                          </SelectItem>
                                        ) : null
                                      )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Explanation */}
                          <FormField
                            control={form.control}
                            name={`questions.${index}.explanation`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Explanation (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Explain why this is the correct answer..."
                                    rows={2}
                                    disabled={updateMutation.isPending}
                                  />
                                </FormControl>
                                <FormDescription>
                                  This explanation will be shown to students
                                  after they answer.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-x-2 pt-6">
                  <LoadingButton
                    type="submit"
                    isLoading={updateMutation.isPending}
                    disabled={!isValid || updateMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Assignment
                  </LoadingButton>

                  {fields.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {fields.length} question{fields.length !== 1 ? "s" : ""}{" "}
                      ready
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChapterAssignmentForm;
