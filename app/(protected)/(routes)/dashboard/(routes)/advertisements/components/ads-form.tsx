"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading-button";
import { createAd } from "@/actions/dashboard/ads/create-ads";
import { useRouter } from "next/navigation";
import { updateAds } from "@/actions/dashboard/ads/update-ads";
import { Ads } from "@/types/ads.type";

const adsFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." })
    .max(500, { message: "Description must not exceed 500 characters." }),
  link: z.string().url({ message: "Please provide a valid URL." }),
  startDate: z.date({ required_error: "A start date is required." }),
  endDate: z.date({ required_error: "An end date is required." }),
  isActive: z.boolean(),
});

export type AdsFormValues = z.infer<typeof adsFormSchema>;

interface AdsFormProps {
  initialData?: Ads;
  type?: "create" | "edit";
}
export default function AdsForm({
  initialData,
  type = "create",
}: AdsFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<AdsFormValues>({
    resolver: zodResolver(adsFormSchema),
    defaultValues:  {
      title: initialData?.title || "",
      description: initialData?.description || "",
      link: initialData?.link || "",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate)
        : new Date(),
      endDate: initialData?.endDate
        ? new Date(initialData.endDate)
        : new Date(),
      isActive: initialData?.isActive ?? true,
    },
  });
  const { isValid } = form.formState;

  const createMutation = useMutation({
    mutationFn: async (data: AdsFormValues) =>
      createAd({
        title: data.title,
        description: data.description,
        link: data.link,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success("Advertisement created successfully!");
      form.reset();
      router.push("/dashboard/advertisements");
    },
    onError: (error) => {
      console.error("Error creating advertisement:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create advertisement"
      );
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: AdsFormValues & { adId: string }) => {
      if (!initialData || !data.adId) {
        throw new Error("Advertisement ID is required for update");
      }
      
      return updateAds({
        id: data.adId,
        title: data.title,
        description: data.description,
        link: data.link,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success("Advertisement updated successfully!");
      router.push("/dashboard/advertisements");
    },
    onError: (error) => {
      console.error("Error updating advertisement:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update advertisement"
      );
    },
  });

  const handleFormSubmit = async (data: AdsFormValues) => {
    if (type === "create") {
      createMutation.mutate(data);
    } else if (type === "edit" && initialData && "id" in initialData) {
      updateMutation.mutate({ ...data, adId: initialData.id });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Advertisement Details</h3>
        <p className="text-sm text-muted-foreground">
          Enter the advertisement details that will be displayed to users.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Advertisement title" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title for your advertisement.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Link Field */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The URL where users will be redirected when clicking the ad.
                  </FormDescription>
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter advertisement description"
                    className="min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a brief description of your advertisement.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date Field */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select when the advertisement should start showing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date Field */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const startDate = form.watch("startDate");
                          if (!startDate) return false;
                          return date < startDate;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select when the advertisement should stop showing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Active Status Field */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    Enable or disable this advertisement.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              size={"sm"}
            >
              {type === "create"
                ? "Create Advertisement"
                : "Update Advertisement"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
