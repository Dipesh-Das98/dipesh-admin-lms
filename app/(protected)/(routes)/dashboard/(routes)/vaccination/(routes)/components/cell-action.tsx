// components/add-vaccination/cell-action.tsx
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
import { VaccinationResponseData } from "@/types/vaccination.type"; 
import { deleteVaccination } from "@/actions/dashboard/vaccination/deleteVaccination";


interface CellActionProps {
  // 2. UPDATED PROP NAME
  vaccination: VaccinationResponseData;
}

const CellAction = ({ vaccination }: CellActionProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    // 3. UPDATED MUTATION FUNCTION
    mutationFn: deleteVaccination, 
    onSuccess: (response) => {
      if (response.success) {
        // 4. UPDATED TOAST MESSAGE
        toast.success("Vaccination record deleted successfully!"); 
        // 3. UPDATED REACT QUERY KEY
        queryClient.invalidateQueries({ queryKey: ["all-vaccinations"] }); 
      } else {
        // 4. UPDATED TOAST MESSAGE
        toast.error(response.message || "Failed to delete vaccination record."); 
      }
    },
    onError: (error) => {
      console.error("Delete vaccination error:", error);
      toast.error("Unexpected error. Try again.");
    },
  });

  const handleEdit = () => {
    // 4. UPDATED ROUTE
    router.push(`/vaccination/edit/${vaccination.id}`); 
  };

  const handleDelete = () => {
    openModal("confirmation-model", {
      // 4. UPDATED MODAL CONFIRM TEXT
      confirmText: "vaccination record", 
      handleConfirm() {
        // 4. USE NEW PROP NAME
        deleteMutation.mutate(vaccination.id); 
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
            {/* 4. UPDATED TEXT */}
            Edit Vaccination
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            {/* 4. UPDATED TEXT */}
            Delete Vaccination
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // 4. USE NEW PROP NAME
              navigator.clipboard.writeText(vaccination.id);
              // 4. UPDATED TOAST MESSAGE
              toast.success("Vaccination ID copied to clipboard!"); 
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