"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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

import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  genderOptions,
  parentRoleOptions,
  avatars,
  Gender,
  Language,
  PARENT_ROLE,
} from "@/config/forms/child-form-options";
import {
  createChild,
  CreateChildData,
} from "@/actions/dashboard/child/create-child";
import {
  updateChild,
  UpdateChildData,
} from "@/actions/dashboard/child/update-child";
import { child } from "@/types";
import { gradeOptions, languageOptions } from "@/config/forms/common-form-options";
import Image from "next/image";

const createFormSchema = (mode: "create" | "edit") => {
  const baseSchema = {
    nickname: z
      .string()
      .min(1, "Please enter the child's preferred name or nickname"),
    avatar: z.string().url(),
    gender: z.string().min(1, "Please select the child's gender"),
    language: z.string().min(1, "Please select the child's primary language"),
    grade: z.string().min(1, "Please enter the child's current grade level"),
    parentId: z
      .string()
      .min(1, "Please enter a valid parent ID to link this child"),
    parentRole: z
      .string()
      .min(1, "Please specify the parent's relationship to this child"),
  };

  if (mode === "create") {
    return z.object({
      ...baseSchema,
      password: z
        .string()
        .max(4, "Password must be exactly 4 characters")
        .min(4, "Password must be exactly 4 characters")
        .regex(/^\d{4}$/, "Password must be a 4-digit number"),
    });
  } else {
    return z.object({
      ...baseSchema,
      password: z.string().optional(),
    });
  }
};

interface ChildFormProps {
  mode: "create" | "edit";
  child?: child;
  childId?: string; // Required for edit mode
}

const ChildForm = ({ mode, child, childId }: ChildFormProps) => {
  const params = useSearchParams();
  const parent = params.get("parentId") || child?.parentId || "";
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get the appropriate schema for the current mode
  const formSchema = createFormSchema(mode);
  type FormType = z.infer<typeof formSchema>;

  //-------------------- FORM--------------------
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: child || {
      nickname: "",
      avatar: "",
      gender: "",
      language: "",
      ...(mode === "create" && { password: "" }),
      grade: "",
      parentId: parent,
      parentRole: "",
    },
  });

  //-------------------- MUTATIONS--------------------
  // Create mutation
  const createMutation = useMutation({
    mutationFn: createChild,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Child created successfully! Redirecting...");
        // Invalidate and refetch children queries
        queryClient.invalidateQueries({ queryKey: ["children"] });
        form.reset();
        // redirect after 2 seconds
        setTimeout(() => {
          router.push(`/dashboard/children`);
        }, 2000);
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Create child error:", error);
      toast.error("Failed to create child. Please try again.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChildData }) =>
      updateChild(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Child updated successfully! Redirecting...");
        // Invalidate and refetch children queries
        queryClient.invalidateQueries({ queryKey: ["children"] });
        // redirect after 2 seconds
        setTimeout(() => {
          router.push(`/dashboard/children`);
        }, 2000);
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update child error:", error);
      toast.error("Failed to update child. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  //-------------------- SUBMIT HANDLER--------------------
  const handleSubmit = async (data: FormType) => {
    try {
      if (mode === "create") {
        // Prepare data for server action
        const createData: CreateChildData = {
          nickname: data.nickname,
          avatar: data.avatar,
          gender: data.gender as Gender,
          language: data.language as Language,
          password: data.password!,
          grade: data.grade,
          parentId: data.parentId,
          parentRole: data.parentRole as PARENT_ROLE,
        };

        createMutation.mutate(createData);
      } else {
        // Update mode - prepare data for update action
        if (!childId) {
          toast.error("Child ID is required for updating");
          return;
        }

        const updateData: UpdateChildData = {
          nickname: data.nickname,
          avatar: data.avatar,
          gender: data.gender as Gender,
          language: data.language as Language,
          grade: data.grade,
          parentId: data.parentId,
          parentRole: data.parentRole as PARENT_ROLE,
        };

        updateMutation.mutate({ id: childId, data: updateData });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Enhanced Two Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Personal Information */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Personal Information
                    </h3>
                  </div>

                  {/* Enhanced nickname */}
                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Preferred Name / nickname
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What does the child like to be called?"
                            {...field}
                            className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                        <p className="text-xs text-muted-foreground/80 bg-muted/30 rounded-md px-3 py-2">
                          💡 This will be used in communications and class
                          rosters
                        </p>
                      </FormItem>
                    )}
                  />

                  {/* Enhanced Avatar Selection */}
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full opacity-0"></span>
                          Profile Avatar
                        </FormLabel>
                        <div className="grid grid-cols-4 gap-3">
                          {avatars.map((avatarUrl, index) => (
                            <div
                              key={index}
                              className={`relative size-20 flex- cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                                field.value === avatarUrl
                                  ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                  : "border-border/50 hover:border-primary/50"
                              }`}
                              onClick={() => field.onChange(avatarUrl)}
                            >
                              <div className="aspect-square flex items-center justify-center  rounded-md relative">
                                <Image
                                  fill
                                  src={avatarUrl}
                                  alt={`Avatar option ${index + 1}`}
                                  className="size-12 object-cover"
                                />
                              </div>
                              {field.value === avatarUrl && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-primary-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <FormMessage className="text-xs" />
                        <p className="text-xs text-muted-foreground/80 bg-muted/30 rounded-md px-3 py-2">
                          🎭 Choose a fun avatar that represents the
                          child&apos;s personality
                        </p>
                      </FormItem>
                    )}
                  />

                  {/* Enhanced Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Child&apos;s Gender
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 w-full border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Please select the child's gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-border/50 ">
                            {genderOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="focus:bg-primary/10"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Enhanced Language */}
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Primary Language of Instruction
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 w-full border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Choose the main language for learning" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-border/50">
                            {languageOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="focus:bg-primary/10"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                        <p className="text-xs text-muted-foreground/80 bg-muted/30 rounded-md px-3 py-2">
                          🌍 This determines the language used for course
                          content and instructions
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Account & Academic Information */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Account & Academic Information
                    </h3>
                  </div>

                  {/* Enhanced Password - Only show in create mode */}
                  {mode === "create" && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Student Login Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Create a 4 digit password"
                              {...field}
                              className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                          <p className="text-xs text-muted-foreground/80 bg-muted/30 rounded-md px-3 py-2">
                            🔐 This password will be used by the child to log
                            into their student account
                          </p>
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Password Info for Edit Mode */}
                  {mode === "edit" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Password Security
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground/80 bg-blue-50/50 dark:bg-blue-950/30 rounded-md px-3 py-2 border border-blue-200/50 dark:border-blue-800/50">
                        🔒 Password changes are handled separately for security
                        reasons. Contact an administrator to reset the
                        child&apos;s password if needed.
                      </p>
                    </div>
                  )}

                  {/* Enhanced Grade */}
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Current Grade Level
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 border-border/50 w-full bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Select grade level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-border/50 w-full">
                            {gradeOptions.map((grade) => (
                              <SelectItem
                                key={grade.value}
                                value={grade.value}
                                className="focus:bg-primary/10"
                              >
                                {grade.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                        <p className="text-xs text-muted-foreground/80 bg-muted/30 rounded-md px-3 py-2">
                          📚 Enter the child&apos;s current academic level for
                          proper course assignment
                        </p>
                      </FormItem>
                    )}
                  />

                  {/* Enhanced Parent ID */}
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Parent Account ID
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the parent's unique ID to link accounts"
                            {...field}
                            className={`h-12 border-border/50 transition-colors duration-200 focus:ring-2 focus:ring-primary/20 ${
                              parent
                                ? "bg-muted/50 text-muted-foreground"
                                : "bg-background/50 focus:bg-background"
                            }`}
                            readOnly={!!parent}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                        {parent && (
                          <p className="text-xs text-green-600/80 bg-green-50/50 dark:bg-green-950/30 rounded-md px-3 py-2 border border-green-200/50 dark:border-green-800/50">
                            ✓ This child will be linked to the selected parent
                            account
                          </p>
                        )}
                        {!parent && (
                          <p className="text-xs text-muted-foreground/80 bg-muted/30 rounded-md px-3 py-2">
                            🔗 This connects the child to their parent&apos;s
                            account for communication and monitoring
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Enhanced Parent Role */}
                  <FormField
                    control={form.control}
                    name="parentRole"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Parent Relationship
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="How is this parent related to the child?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-border/50">
                            {parentRoleOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="focus:bg-primary/10"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                        <p className="text-xs text-muted-foreground/80 bg-muted/30 rounded-md px-3 py-2">
                          👨‍👩‍👧‍👦 Define the family relationship for proper
                          permissions and communication
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Form Actions */}
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fields marked with{" "}
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>{" "}
                    are required
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="min-w-[120px] h-12 border-border/50 hover:bg-muted/50 transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  className="min-w-[140px] h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            mode === "create"
                              ? "M12 6v6m0 0v6m0-6h6m-6 0H6"
                              : "M5 13l4 4L19 7"
                          }
                        />
                      </svg>
                      <span>
                        {mode === "create" ? "Create Child" : "Update Child"}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChildForm;
