"use client";
import { Admin } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, MoreHorizontal, Trash2, Lock, Unlock } from "lucide-react";
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
import { deleteAdmin } from "@/actions/dashboard/admin/delete-admin";
import { toggleAdminBlock } from "@/actions/dashboard/admin/toggle-admin-block";

interface CellActionProps {
  admin: Admin;
}

const CellAction = ({ admin }: CellActionProps) => {
  const { openModal } = useModal();
  const { openSheet } = useSheet();
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Admin deleted successfully!");
        // Invalidate and refetch admins queries
        queryClient.invalidateQueries({ queryKey: ["admins"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete admin error:", error);
      toast.error("Failed to delete admin. Please try again.");
    },
  });

  // Toggle block mutation
  const toggleBlockMutation = useMutation({
    mutationFn: toggleAdminBlock,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        // Invalidate and refetch admins queries
        queryClient.invalidateQueries({ queryKey: ["admins"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Toggle admin block error:", error);
      toast.error(`Failed to ${admin.isBlocked ? 'unblock' : 'block'} admin. Please try again.`);
    },
  });

  const handleEditClick = () => {
    openSheet("admin-form", { mode: "edit", admin });
  };

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      title: "Delete Admin",
      description: `Are you sure you want to delete ${admin.name}? This action cannot be undone.`,
      confirmButtonText: "Delete",
      handleConfirm() {
        deleteMutation.mutate({ id: admin.id });
      },
    });
  };

  const handleToggleBlockClick = () => {
    openModal("confirmation-model", {
      title: admin.isBlocked ? "Unblock Admin" : "Block Admin",
      description: admin.isBlocked 
        ? `Are you sure you want to unblock ${admin.name}?` 
        : `Are you sure you want to block ${admin.name}?`,
      confirmButtonText: admin.isBlocked ? "Unblock" : "Block",
      handleConfirm() {
        toggleBlockMutation.mutate({ 
          id: admin.id, 
          blocked: !admin.isBlocked 
        });
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
            onClick={handleToggleBlockClick}
            className={admin.isBlocked ? "text-green-600" : "text-orange-600"}
          >
            {admin.isBlocked ? (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Unblock
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Block
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(admin.id);
              toast.success("Admin ID copied to clipboard!");
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
