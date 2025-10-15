// components/tables/pregnancy-week-content-table/cell-action.tsx

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

// Import local components and types
import { useModal } from "@/hooks/use-modal";
// FIX: Import the correct delete action
// FIX: Import the correct type
import { PregnancyWeekContent } from "@/types/pregnancy.type"; 
import { deletePregnancyWeekContent } from "@/actions/dashboard/pregnancy/delete-pregnancy-by-id";

interface CellActionProps {
  // FIX: Update prop type name
  content: PregnancyWeekContent; 
}

// FIX: Update component name and prop destructuring
const PregnancyWeekContentCellAction = ({ content }: CellActionProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    // FIX: Use the correct delete function
    mutationFn: deletePregnancyWeekContent, 
    onSuccess: (response) => {
      if (response.success) {
        // FIX: Update success message and query key
        toast.success("Pregnancy Week Content deleted successfully! 🗑️");
        queryClient.invalidateQueries({ queryKey: ["pregnancy-week-content"] }); 
      } else {
        toast.error(response.message || "Failed to delete content.");
      }
    },
    onError: (error) => {
      console.error("Delete content error:", error);
      toast.error("Unexpected error. Try again.");
    },
  });

  const handleEdit = () => {
    // FIX: Update the routing path
    router.push(`/dashboard/pregnancyWeekContent/edit/${content.id}`);
  };

  const handleDelete = () => {
    openModal("confirmation-model", {
      // FIX: Update confirmation text
      confirmText: "content item", 
      handleConfirm() {
        // FIX: Use the correct ID from the content prop
        deleteMutation.mutate(content.id); 
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Content
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Content
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // FIX: Use the correct ID
              navigator.clipboard.writeText(content.id); 
              toast.success("Content ID copied to clipboard! 📋");
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

// FIX: Export the renamed component
export default PregnancyWeekContentCellAction;