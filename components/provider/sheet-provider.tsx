"use client";

import { useEffect, useState } from "react";

import { GameFormContent } from "@/app/(protected)/(routes)/dashboard/(routes)/games/(root)/components/create-game-form";
import { ParentFormContent } from "@/app/(protected)/(routes)/dashboard/(routes)/parents/(routes)/components/parent-form";
import { CreateCourseSheet } from "@/app/(protected)/(routes)/dashboard/(routes)/course/(root)/components/create-course-sheet";
import { CreateCategorySheet } from "@/app/(protected)/(routes)/dashboard/(routes)/categories/components/create-category-sheet";
import { AdminFormContent } from "@/app/(protected)/(routes)/dashboard/(routes)/admin/(routes)/components/admin-form";
import EditPaymentStatus from "@/app/(protected)/(routes)/dashboard/(routes)/payments/(root)/components/components/edit-payment-sidebar";

export const SheetProvider = () => {
  // Hydration Fix
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
      <ParentFormContent />
      <GameFormContent />
      <CreateCourseSheet />
      <CreateCategorySheet />
      <AdminFormContent />
      <EditPaymentStatus />
    </>
  );
};
