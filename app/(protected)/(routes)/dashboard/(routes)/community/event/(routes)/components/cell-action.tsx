"use client";
import { Event } from "@/actions/dashboard/community/event";
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
import { deleteEvent } from "@/actions/dashboard/community/event";
import { useSheet } from "@/hooks/use-sheet";

interface CellActionProps {
  event: Event;
}

const CellAction = ({ event }: CellActionProps) => {
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const { openSheet } = useSheet();

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Event deleted successfully!");
        // Invalidate and refetch events queries
        queryClient.invalidateQueries({ queryKey: ["events"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete event error:", error);
      toast.error("Failed to delete event. Please try again.");
    },
  });

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "event",
      handleConfirm() {
        deleteMutation.mutate(event.id);
      },
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(event.id);
    toast.success("Event ID copied to clipboard!");
  };

  const handleEditClick = () => {
    openSheet("event-form", {
      mode: "edit",
      event: event,
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
          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
