"use client";
import { Parent } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, MoreHorizontal, Plus, Trash2, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { useSheet } from "@/hooks/use-sheet";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteParent } from "@/actions/dashboard/parent/delete-parent";
import Link from "next/link";
import { makeModerator, removeModerator } from "@/actions/dashboard/community/moderator";

interface CellActionProps {
  parent: Parent;
}

const CellAction = ({ parent }: CellActionProps) => {
  const { openModal } = useModal();
  const { openSheet } = useSheet();
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteParent,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Parent deleted successfully!");
        // Invalidate and refetch parents queries
        queryClient.invalidateQueries({ queryKey: ["parents"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete parent error:", error);
      toast.error("Failed to delete parent. Please try again.");
    },
  });

  const handleEditClick = () => {
    openSheet("parent-form", { mode: "edit", parent });
  };

  const makeModeratorMutation = useMutation({
    mutationFn: makeModerator,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Moderator made successfully!");
        queryClient.invalidateQueries({ queryKey: ["parents"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Make moderator error:", error);
      toast.error("Failed to make moderator. Please try again.");
    },
  });

  const removeModeratorMutation = useMutation({
    mutationFn: removeModerator,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Moderator removed successfully!");
        queryClient.invalidateQueries({ queryKey: ["parents"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Remove moderator error:", error);
      toast.error("Failed to remove moderator. Please try again.");
    },
  });

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "parent",
      handleConfirm() {
        deleteMutation.mutate({ id: parent.id });
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
              navigator.clipboard.writeText(parent.id);
              toast.success("Parent ID copied to clipboard!");
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/children/add?parentId=${parent.id}`}
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Child
            </Link>
          </DropdownMenuItem>
          {parent.role === 'PARENT' ? <DropdownMenuItem
            onClick={() => {
              makeModeratorMutation.mutate({ userId: parent.id });
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Make Moderator
          </DropdownMenuItem>: <DropdownMenuItem
            onClick={() => {
              removeModeratorMutation.mutate(parent.id);
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Remove Moderator
          </DropdownMenuItem>}
          
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
