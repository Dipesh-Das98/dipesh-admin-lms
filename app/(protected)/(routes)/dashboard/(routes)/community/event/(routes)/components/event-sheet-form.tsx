"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  createEvent,
  TargetType,
  updateEvent,
} from "@/actions/dashboard/community/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSheet } from "@/hooks/use-sheet";

// Form schemas
const eventFormSchema = z.object({
  eventName: z
    .string()
    .min(3, { message: "Event name must be at least 3 characters." })
    .max(100, { message: "Event name must not exceed 100 characters." }),
  eventDateTime: z
    .string()
    .min(1, { message: "Event date and time is required." }),
  targetType: z.enum(["ALL", "PARENT"], {
    required_error: "Please select a target type.",
  }),
  parentId: z.string().min(1, { message: "Parent ID is required." }),
  isActive: z.boolean(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

// Sheet content component that will be used by the provider
export function EventFormContent() {
  const queryClient = useQueryClient();
  const { isOpen, onClose, type, data } = useSheet();

  const isEventFormOpen = isOpen && type === "event-form";
  const { mode = "create", event } = data;
  const isEditMode = mode === "edit";

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: event?.eventName || "",
      eventDateTime: event?.eventDateTime
        ? new Date(event.eventDateTime).toISOString().slice(0, 16)
        : "",
      targetType: (event?.targetType || "ALL") as TargetType,
      parentId: event?.parentId || "",
      isActive: event?.isActive ?? true,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Event created successfully!");
        // Invalidate and refetch events queries
        queryClient.invalidateQueries({ queryKey: ["events"] });
        onClose();
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Create event error:", error);
      toast.error("Failed to create event. Please try again.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Event updated successfully!");
        // Invalidate and refetch events queries
        queryClient.invalidateQueries({ queryKey: ["events"] });
        onClose();
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update event error:", error);
      toast.error("Failed to update event. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Reset form when sheet opens or event data changes
  React.useEffect(() => {
    if (isEventFormOpen) {
      form.reset({
        eventName: event?.eventName || "",
        eventDateTime: event?.eventDateTime
          ? new Date(event.eventDateTime).toISOString().slice(0, 16)
          : "",
        targetType: (event?.targetType || "ALL") as TargetType,
        parentId: event?.parentId || "",
        isActive: event?.isActive ?? true,
      });
    }
  }, [isEventFormOpen, event, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
      // Reset form when closing
      form.reset({
        eventName: "",
        eventDateTime: "",
        targetType: "ALL" as TargetType,
        parentId: "",
        isActive: true,
      });
    }
  };

  const onSubmit = async (data: EventFormData) => {
    // Convert datetime-local input to ISO string
    const eventDateTime = new Date(data.eventDateTime).toISOString();

    if (isEditMode && event) {
      updateMutation.mutate({
        id: event.id,
        ...data,
        eventDateTime,
      });
    } else {
      createMutation.mutate({
        ...data,
        eventDateTime,
      });
    }
  };

  return (
    <Sheet open={isEventFormOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Edit Event" : "Create Event"}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the event details below."
              : "Fill in the details to create a new event."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              {/* Event Name Field */}
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter event name"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive name for the event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Date & Time Field */}
              <FormField
                control={form.control}
                name="eventDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      When will this event take place?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Type Field */}
              <FormField
                control={form.control}
                name="targetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">All Users</SelectItem>
                        <SelectItem value="PARENT">Specific Users</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Who should this event target?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parent ID Field */}
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter parent ID"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      The parent ID associated with this event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status Field */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this event.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Event"
                  : "Create Event"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
