"use client";

import { useEffect, useState } from "react";

import { GameFormContent } from "@/app/(protected)/(routes)/dashboard/(routes)/games/(root)/components/create-game-form";
import { ParentFormContent } from "@/app/(protected)/(routes)/dashboard/(routes)/parents/(routes)/components/parent-form";
import { CreateCourseSheet } from "@/app/(protected)/(routes)/dashboard/(routes)/course/(root)/components/create-course-sheet";
import { CreateCategorySheet } from "@/app/(protected)/(routes)/dashboard/(routes)/categories/components/create-category-sheet";
import { AdminFormContent } from "@/app/(protected)/(routes)/dashboard/(routes)/admin/(routes)/components/admin-form";
import EditPaymentStatus from "@/app/(protected)/(routes)/dashboard/(routes)/payments/(root)/components/components/edit-payment-sidebar";
import { AdvertisementFormContent } from "@/app/(protected)/(routes)/dashboard/(routes)/community/advertisement/(routes)/components/advertisement-sheet-form";
import { PostCategoryFormContent } from "@/app/(protected)/(routes)/dashboard/(routes)/community/post-category/(routes)/components/post-category-sheet-form";
import { EventFormContent } from "@/app/(protected)/(routes)/dashboard/(routes)/community/event/(routes)/components/event-sheet-form";

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
      <AdvertisementFormContent />
      <PostCategoryFormContent />
      <EventFormContent />
    </>
  );
};