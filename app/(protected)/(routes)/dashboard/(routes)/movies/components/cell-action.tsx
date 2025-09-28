"use client";

import { Movie } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Copy 
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { deleteMovie } from "@/actions/dashboard/movie/delete-movie";

interface CellActionProps {
  movie: Movie;
}

const CellAction = ({ movie }: CellActionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMovie,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Movie deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["movies"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete movie error:", error);
      toast.error("Failed to delete movie. Please try again.");
    },
  });

  const handleEdit = () => {
    router.push(`/dashboard/movies/edit/${movie.id}`);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(movie.id);
    toast.success("Movie ID copied to clipboard!");
  };

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "movie",
      handleConfirm() {
        deleteMutation.mutate(movie.id);
      }
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDeleteClick}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { CellAction };
