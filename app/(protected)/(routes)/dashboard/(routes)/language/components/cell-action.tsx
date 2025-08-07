"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { deleteLanguageCorner } from "@/actions/dashboard/language/delete-language";
import { LanguageCorner } from "@/types";

interface CellActionProps {
  languageCorner: LanguageCorner;
}

const CellAction = ({ languageCorner }: CellActionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteLanguageCorner,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Language corner content deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["language-corner"] });
      } else {
        const errorMessage = response.message.includes("Unauthorized")
          ? "You are not authorized to delete this Lnguage Corner content"
          : response.message;
        toast.error(errorMessage || "Failed to delete language corner content");
      }
    },
    onError: (error) => {
      console.error("Delete language corner error:", error);
      toast.error(
        "Failed to delete language corner content. Please try again."
      );
    },
  });

  const handleEdit = () => {
    router.push(`/dashboard/language/edit/${languageCorner.id}`);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(languageCorner.id);
    toast.success("Language corner ID copied to clipboard!");
  };

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "language corner content",
      handleConfirm() {
        deleteMutation.mutate(languageCorner.id);
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Content
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Content
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
