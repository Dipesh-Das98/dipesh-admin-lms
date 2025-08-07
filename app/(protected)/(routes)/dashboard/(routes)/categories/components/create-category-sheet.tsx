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
import CategoryForm from "./category-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CreateCategorySheet() {
  const { isOpen, onClose, type } = useSheet();

  const isCourseFormOpen = isOpen && type === "category-form";
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Sheet open={isCourseFormOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Create New Category</SheetTitle>
          <SheetDescription>
            Fill in the details below to create a new Category.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] p-4">
          <CategoryForm handleClose={onClose} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
