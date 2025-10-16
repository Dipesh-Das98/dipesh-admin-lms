// components/cell-action.tsx (for Hospitals)
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
// FIX 1: Import the correct type for Hospital
import { HospitalRecord } from "@/types/hospital.type"; 
import { deleteHospital } from "@/actions/dashboard/hospital/deleteHospital";
// FIX 2: Import the correct delete action for Hospitals

interface CellActionProps {
  // FIX 3: Change prop type to HospitalRecord
  hospital: HospitalRecord;
}

// FIX 4: Update the component name and parameter destructuring
const CellAction = ({ hospital }: CellActionProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    // FIX 5: Use the correct delete function
    mutationFn: deleteHospital,
    onSuccess: (response) => {
      if (response.success) {
        // FIX 6: Update toast message
        toast.success("Hospital deleted successfully!");
        // FIX 7: Invalidate the correct query key
        queryClient.invalidateQueries({ queryKey: ["hospitals"] }); 
      } else {
        // FIX 8: Update toast message
        toast.error(response.message || "Failed to delete hospital.");
      }
    },
    onError: (error) => {
      console.error("Delete Hospital error:", error);
      toast.error("Unexpected error. Try again.");
    },
  });

  const handleEdit = () => {
    // FIX 9: Update navigation path to the hospital edit page
    router.push(`/dashboard/hospitals/edit/${hospital.id}`);
  };

  const handleDelete = () => {
    openModal("confirmation-model", {
      // FIX 10: Update confirmation text
      confirmText: "hospital",
      handleConfirm() {
        deleteMutation.mutate(hospital.id);
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
            Edit Hospital
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Hospital
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // FIX 11: Use the hospital ID
              navigator.clipboard.writeText(hospital.id);
              // FIX 12: Update toast message
              toast.success("Hospital ID copied to clipboard!");
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