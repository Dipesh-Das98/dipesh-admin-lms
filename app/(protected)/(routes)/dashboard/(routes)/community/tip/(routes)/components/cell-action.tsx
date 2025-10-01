"use client";
import { Tip } from "@/actions/dashboard/community/tip";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTip } from "@/actions/dashboard/community/tip";
import Link from "next/link";

interface CellActionProps {
  tip: Tip;
}

const CellAction = ({ tip }: CellActionProps) => {
  console.log(tip);
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  // Delete tip mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTip,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Tip deleted successfully!");
        // Invalidate and refetch tips queries
        queryClient.invalidateQueries({ queryKey: ["tips"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete tip error:", error);
      toast.error("Failed to delete tip. Please try again.");
    },
  });

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "tip",
      handleConfirm() {
        deleteMutation.mutate(tip.id);
      },
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(tip.id);
    toast.success("Tip ID copied to clipboard!");
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
          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/dashboard/community/tip/edit/${tip.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Tip
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Tip
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
