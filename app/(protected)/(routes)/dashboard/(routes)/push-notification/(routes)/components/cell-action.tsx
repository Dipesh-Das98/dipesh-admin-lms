"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { PushNotificationTemplate } from "@/types/push-notification.type";
import { deletePushNotificationTemplate } from "@/actions/dashboard/push-notification/delete-push-notification-by-id";

interface CellActionProps {
  pushNotificationTemplates: PushNotificationTemplate;
}

const CellAction = ({ pushNotificationTemplates }: CellActionProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deletePushNotificationTemplate,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Help Topic deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["help-topics"] });
      } else {
        toast.error(response.message || "Failed to delete Help Topic.");
      }
    },
    onError: (error) => {
      console.error("Delete Help Topic error:", error);
      toast.error("Unexpected error. Try again.");
    },
  });

  const handleEdit = () => {
    router.push(`/dashboard/push-notification/edit/${pushNotificationTemplates.id}`);
  };

  const handleDelete = () => {
    openModal("confirmation-model", {
      confirmText: "push notification",
      handleConfirm() {
        deleteMutation.mutate(pushNotificationTemplates.id);
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
          <DropdownMenuItem onClick={handleEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(pushNotificationTemplates.id);
              toast.success("Help Topic ID copied to clipboard!");
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