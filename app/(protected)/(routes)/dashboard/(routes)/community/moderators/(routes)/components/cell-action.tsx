"use client";
import { Moderator } from "@/actions/dashboard/community/moderator";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Trash2, Ban, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  removeModerator,
  banUser,
  unbanUser,
} from "@/actions/dashboard/community/moderator";

interface CellActionProps {
  moderator: Moderator;
}

const CellAction = ({ moderator }: CellActionProps) => {
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  // Remove moderator mutation
  const removeMutation = useMutation({
    mutationFn: removeModerator,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Moderator removed successfully!");
        // Invalidate and refetch moderators queries
        queryClient.invalidateQueries({ queryKey: ["moderators"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Remove moderator error:", error);
      toast.error("Failed to remove moderator. Please try again.");
    },
  });

  // Ban user mutation
  const banMutation = useMutation({
    mutationFn: ({
      userId,
      banType,
    }: {
      userId: string;
      banType: "TEMPORARY_BAN" | "PERMANENT_BAN";
    }) => banUser(userId, { banType }),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("User banned successfully!");
        queryClient.invalidateQueries({ queryKey: ["moderators"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Ban user error:", error);
      toast.error("Failed to ban user. Please try again.");
    },
  });

  // Unban user mutation
  const unbanMutation = useMutation({
    mutationFn: unbanUser,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("User unbanned successfully!");
        queryClient.invalidateQueries({ queryKey: ["moderators"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Unban user error:", error);
      toast.error("Failed to unban user. Please try again.");
    },
  });

  const handleRemoveClick = () => {
    openModal("confirmation-model", {
      confirmText: "moderator",
      handleConfirm() {
        removeMutation.mutate(moderator.parentId);
      },
    });
  };

  const handleBanClick = (banType: "TEMPORARY_BAN" | "PERMANENT_BAN") => {
    openModal("confirmation-model", {
      confirmText: `ban user (${
        banType === "TEMPORARY_BAN" ? "Temporary" : "Permanent"
      })`,
      description: `Are you sure you want to ${
        banType === "TEMPORARY_BAN" ? "temporarily ban" : "permanently ban"
      } this user?`,
      confirmButtonText:
        banType === "TEMPORARY_BAN" ? "Temporary Ban" : "Permanent Ban",
      handleConfirm() {
        banMutation.mutate({ userId: moderator.parentId, banType });
      },
    });
  };

  const handleUnbanClick = () => {
    openModal("confirmation-model", {
      confirmText: "unban user",
      description: "Are you sure you want to unban this user?",
      confirmButtonText: "Unban User",
      handleConfirm() {
        unbanMutation.mutate(moderator.parentId);
      },
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(moderator.id);
    toast.success("Moderator ID copied to clipboard!");
  };
  const handleCopyParentId = () => {
    navigator.clipboard.writeText(moderator.parentId);
    toast.success("Moderator Parent ID copied to clipboard!");
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
          <DropdownMenuItem onClick={handleCopyParentId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Parent ID
          </DropdownMenuItem>

          {!moderator.banStatus ? (
            <>
              <DropdownMenuItem
                onClick={() => handleBanClick("TEMPORARY_BAN")}
                className="text-orange-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                Temporary Ban
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleBanClick("PERMANENT_BAN")}
                className="text-red-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                Permanent Ban
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={handleUnbanClick}
              className="text-green-600"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Unban User
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={handleRemoveClick}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Moderator
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
