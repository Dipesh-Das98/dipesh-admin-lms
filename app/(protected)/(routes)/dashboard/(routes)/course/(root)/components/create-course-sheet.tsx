"use client";
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSheet } from "@/hooks/use-sheet";
import { Category } from "@/types";
import { Loader } from "lucide-react";
import CourseForm from "../../add/compnents/create-course-form";
import useCategory from "@/hooks/use-category";

export function CreateCourseSheet() {
  const { isOpen, onClose, type } = useSheet();

  const isCourseFormOpen = isOpen && type === "course-form";
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  const { data: categories = [], isLoading } =
    useCategory<Category[]>("course");

  if (isLoading) <Loader className="w-6 h-6 animate-spin" />;

  return (
    <Sheet open={isCourseFormOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader>
          <SheetTitle>Create New Course</SheetTitle>
          <SheetDescription>
            Fill in the details below to create a new course.
          </SheetDescription>
        </SheetHeader>

        <CourseForm
          handleClose={onClose}
         type="sheet" categories={categories || []} />
      </SheetContent>
    </Sheet>
  );
}
