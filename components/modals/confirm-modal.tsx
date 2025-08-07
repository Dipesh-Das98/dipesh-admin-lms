"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModal } from "@/hooks/use-modal";

import React from "react";

const ConfirmModal = () => {
  const { type, onClose, data } = useModal();

  const isOpenModel = type === "confirmation-model";
  const {
    handleConfirm,
    confirmText,
    title = "Are you sure?",
    description,
    confirmButtonText = "Delete",
  } = data;

  // Determine description based on provided data
  const modalDescription =
    description ||
    (confirmText
      ? `You are about to delete this ${confirmText}. This action cannot be undone.`
      : "This action cannot be undone.");

  return (
    <AlertDialog open={isOpenModel} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>{modalDescription}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              confirmButtonText.toLowerCase() === "delete"
                ? "bg-destructive hover:bg-destructive/90"
                : ""
            }
          >
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
