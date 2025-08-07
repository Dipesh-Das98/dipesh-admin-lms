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
import { FamilyHealthCourse } from "@/types/familyHealth.types";
import { deleteFamilyHealthCourse } from "@/actions/dashboard/familyHealth/delete-family-health-course-by-id";

interface CellActionProps {
  story: FamilyHealthCourse;
}

const CellAction = ({ story }: CellActionProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteFamilyHealthCourse,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Family Health Course deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["family-health-courses"] });
      } else {
        toast.error(response.message || "Failed to delete family health course.");
      }
    },
    onError: (error) => {
      console.error("Delete family health course error:", error);
      toast.error("Unexpected error. Try again.");
    },
  });

  const handleEdit = () => {
    router.push(`/dashboard/familyHealth/edit/${story.id}`);
  };

  const handleDelete = () => {
    openModal("confirmation-model", {
      confirmText: "family health course",
      handleConfirm() {
        deleteMutation.mutate(story.id);
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
            Edit Family Health
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Family Health
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(story.id);
              toast.success("Story ID copied to clipboard!");
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
