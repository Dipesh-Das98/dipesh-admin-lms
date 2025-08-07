"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createParent } from "@/actions/dashboard/parent/create-parent";
import { updateParent } from "@/actions/dashboard/parent/update-parent";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/hooks/use-sheet";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Form schemas
const createParentSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z
    .string().refine((value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber ? phoneNumber.isValid() : false;
    }, {
      message: "Please enter a valid phone number",
    })
});

const updateParentSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(1, "Username is required"),
  phone: z
    .string().refine((value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber ? phoneNumber.isValid() : false;
    }, {

      message: "Please enter a valid phone number",
    }
    ).optional(),
  password: z
    .string()
    .optional().refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
});

type CreateParentFormData = z.infer<typeof createParentSchema>;
type UpdateParentFormData = z.infer<typeof updateParentSchema>;

// Sheet content component that will be used by the provider
export function ParentFormContent() {
  const queryClient = useQueryClient();
  const { isOpen, onClose, type, data } = useSheet();

  const isParentFormOpen = isOpen && type === "parent-form";
  const { mode = "create", parent } = data;
  const isEditMode = mode === "edit";

  const schema = isEditMode ? updateParentSchema : createParentSchema;

  const form = useForm<CreateParentFormData | UpdateParentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: parent?.email || "",
      username: parent?.username || "",
      phone: parent?.phone || "",
      password: isEditMode ? "" : "", // Password is not required for edit mode
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createParent,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Parent created successfully!");
        // Invalidate and refetch parents queries
        queryClient.invalidateQueries({ queryKey: ["parents"] });
        onClose();
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Create parent error:", error);
      toast.error("Failed to create parent. Please try again.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateParent,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Parent updated successfully!");
        // Invalidate and refetch parents queries
        queryClient.invalidateQueries({ queryKey: ["parents"] });
        onClose();
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update parent error:", error);
      toast.error("Failed to update parent. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Reset form when sheet opens or parent data changes
  React.useEffect(() => {
    if (isParentFormOpen) {
      form.reset({
        email: parent?.email || "",
        username: parent?.username || "",
        phone: parent?.phone || "",
        password: isEditMode ? "" : "", // Password is not required for edit mode
      });
    }
  }, [isParentFormOpen, parent, isEditMode, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
      // Reset form when closing
      form.reset();
    }
  };

  const onSubmit = async (
    data: CreateParentFormData | UpdateParentFormData
  ) => {
    if (isEditMode && parent) {
      updateMutation.mutate({
        id: parent.id,
        ...(data as UpdateParentFormData),
      });
    } else {
      createMutation.mutate(data as CreateParentFormData);
    }
  };

  return (
    <Sheet open={isParentFormOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Parent" : "Create New Parent"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the parent account information below."
              : "Fill in the details below to create a new parent account."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="parent@example.com"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter username"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+2519XXXXXXXX"
                        disabled={isSubmitting}
                      />
                    </FormControl>
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
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Parent"
                    : "Create Parent"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
