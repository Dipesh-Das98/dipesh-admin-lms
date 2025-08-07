"use client";
import { useEffect, useState } from "react";
import ConfirmModal from "../modals/confirm-modal";
import MediaUploadModal from "../modals/media-upload-modal";
import ParentIdDialog from "@/app/(protected)/(routes)/dashboard/(routes)/payments/(root)/components/components/parent-id-modal";

export const ModalProvider = () => {
  // Hydration Fix
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <ConfirmModal />
      <MediaUploadModal />
      <ParentIdDialog/>
    </>
  );
};
