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
import { deleteSymptomReliefTip } from "@/actions/dashboard/symptom-relief/delete-symptom-relief-tip-by-id";
import { PregnancyNutritionTip } from "@/types/pregnancy-nutrition.type";
// CORRECTED PATH HERE:

interface CellActionProps {
  tip: PregnancyNutritionTip;
}

const CellAction = ({ tip }: CellActionProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteSymptomReliefTip,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Pregnancy Nutrition Tip deleted successfully! 🗑️");
        queryClient.invalidateQueries({ queryKey: ["pregnancy-nutrition"] });
      } else {
        toast.error(response.message || "Failed to delete tip.");
      }
    },
    onError: (error) => {
      console.error("Delete tip error:", error);
      toast.error("Unexpected error. Try again.");
    },
  });

  const handleEdit = () => {
    router.push(`/dashboard/pregnancy-nutrition/edit/${tip.id}`);
  };

  const handleDelete = () => {
    openModal("confirmation-model", {
      confirmText: "tip",
      handleConfirm() {
        deleteMutation.mutate(tip.id);
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
            Edit Tip
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Tip
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(tip.id);
              toast.success("Tip ID copied to clipboard! 📋");
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