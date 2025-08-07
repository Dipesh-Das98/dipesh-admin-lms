"use client";

import { Library } from "@/types";
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
import { deleteLibrary } from "@/actions/dashboard/library/delete-library";

interface CellActionProps {
  library: Library;
}

export function CellAction({ library }: CellActionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  const { mutate: deleteLibraryMutation, isPending } = useMutation({
    mutationFn: () => deleteLibrary(library.id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
      if(!res.success) {
        const errorMessage = res.message.includes("Unauthorized") ? "You are not authorized to delete this library" : res.message;
        toast.error(errorMessage || "Failed to delete library");
        return;
      }
      toast.success("Library deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Library ID copied to clipboard");
  };

  const onDelete = () => {
    openModal("confirmation-model", {
      confirmText: "Library",
      handleConfirm: () => deleteLibraryMutation(),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/library/edit/${library.id}`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCopy(library.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          disabled={isPending}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
