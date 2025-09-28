"use client";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Pen, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAd } from "@/actions/dashboard/ads/delete-ads";
import { Ads } from "@/types/ads.type";
import { useRouter } from "next/navigation";

interface CellActionProps {
  ads: Ads;
}

const CellAction = ({  ads}: CellActionProps) => {
  const router=useRouter()
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  // Delete mutation for payment
  const deleteMutation = useMutation({
    mutationFn: (vars: { id: string }) => deleteAd(vars.id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Ad deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["ads"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete ads error:", error);
      toast.error("Failed to delete ads. Please try again.");
    },
  });

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "ads",
      handleConfirm() {
        deleteMutation.mutate({ id: ads.id });
      },
    });
  };
  const handleEditClick = () => {
    router.push(`/dashboard/advertisements/${ads.id}`);
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-muted focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <span className="sr-only">Payment Actions</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="min-w-[180px] border-border/50 p-1"
        >
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(ads.id);
              toast.success("Payment ID copied to clipboard!");
            }}
            className="flex items-center cursor-pointer rounded-md hover:bg-muted focus:bg-muted py-2"
          >
            <Copy className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Copy ID</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleEditClick}
           className="flex items-center cursor-pointer rounded-md hover:bg-muted focus:bg-muted py-2">
            <Pen className="mr-2 h-4 w-4 " />
            <span className="text-sm">Edit Ads</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDeleteClick}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="text-sm">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
