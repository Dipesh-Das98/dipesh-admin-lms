"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createAdmin } from "@/actions/dashboard/admin/create-admin";
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
import { updateAdmin } from "@/actions/dashboard/admin/update-admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form schemas
const createAdminSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]).default("ADMIN"),
});

const updateAdminSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required"),
});

type CreateAdminFormData = z.infer<typeof createAdminSchema>;
type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;

// Sheet content component that will be used by the provider
export function AdminFormContent() {
  const queryClient = useQueryClient();
  const { isOpen, onClose, type, data } = useSheet();

  const isAdminFormOpen = isOpen && type === "admin-form";
  const { mode = "create", admin } = data;
  const isEditMode = mode === "edit";

  const schema = isEditMode ? updateAdminSchema : createAdminSchema;

  const form = useForm<CreateAdminFormData | UpdateAdminFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: admin?.email || "",
      name: admin?.name || "",
      role:admin?.role || "ADMIN",
      ...(isEditMode ? {} : { password: "" }),
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Admin created successfully!");
        // Invalidate and refetch admins queries
        queryClient.invalidateQueries({ queryKey: ["admins"] });
        onClose();
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Create admin error:", error);
      toast.error("Failed to create admin. Please try again.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateAdmin,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Admin updated successfully!");
        // Invalidate and refetch admins queries
        queryClient.invalidateQueries({ queryKey: ["admins"] });
        onClose();
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update admin error:", error);
      toast.error("Failed to update admin. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Reset form when sheet opens or admin data changes
  React.useEffect(() => {
    if (isAdminFormOpen) {
      form.reset({
        email: admin?.email || "",
        name: admin?.name || "",
        ...(isEditMode ? {} : { password: "" }),
      });
    }
  }, [isAdminFormOpen, admin, isEditMode, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
      // Reset form when closing
      form.reset({
        email: "",
        name: "",
        ...(isEditMode ? {} : { password: "" }),
      });
    }
  };

  const onSubmit = async (data: CreateAdminFormData | UpdateAdminFormData) => {
    if (isEditMode && admin) {
      updateMutation.mutate({
        id: admin.id,
        ...(data as UpdateAdminFormData),
      });
    } else {
      createMutation.mutate(data as CreateAdminFormData);
    }
  };

  return (
    <Sheet open={isAdminFormOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Admin" : "Create New Admin"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the admin account information below."
              : "Fill in the details below to create a new admin account."}
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
                        placeholder="admin@example.com"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
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

              {!isEditMode && (
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
                          placeholder="Enter password"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger disabled={isSubmitting}>
                        <SelectValue placeholder="Select admin role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      </SelectContent>
                      </Select>
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
                  ? "Update Admin"
                  : "Create Admin"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
