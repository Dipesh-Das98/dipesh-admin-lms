"use client";
import { child } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChild } from "@/actions/dashboard/child/delete-child";
import { useRouter } from "next/navigation";

interface CellActionProps {
  child: child;
}

const CellAction = ({ child }: CellActionProps) => {
  const { openModal } = useModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteChild,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Child deleted successfully!");
        // Invalidate and refetch children queries
        queryClient.invalidateQueries({ queryKey: ["children"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete child error:", error);
      toast.error("Failed to delete child. Please try again.");
    },
  });

  const handleEditClick = () => {
    router.push(`/dashboard/children/edit/${child.id}`);
  };

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "child",
      handleConfirm() {
        deleteMutation.mutate({ id: child.id });
      },
    });
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center">


          <DropdownMenuItem onClick={handleEditClick}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(child.id);
              toast.success("Child ID copied to clipboard!");
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
