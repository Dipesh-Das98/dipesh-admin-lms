"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
const ParentIdDialog = () => {
  const { type, onClose } = useModal();
  const isOpenModel = type === "parent-id-model";
  const [parentId, setParentId] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (parentId.trim()) {
      router.push(`/dashboard/payments/add?parentId=${parentId}`);
      // clear the input field after submission
        setParentId("");
      onClose();
    } else {
      alert("Please enter a valid Parent ID.");
    }
  };

  return (
    <Dialog open={isOpenModel} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Parent ID</DialogTitle>
          <DialogDescription>
            Please provide the Parent ID to route to the payment creation page.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="default" >
          <Terminal className="h-4 w-4" />
          <AlertTitle>How to find Parent ID</AlertTitle>
          <AlertDescription className="text-sm">
            Go to the Parent Management section, find the parent, and copy their ID to paste here.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="parentId" className="text-sm font-medium">Parent ID</label>
            <Input
              id="parentId"
              type="text"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              placeholder="Enter Parent ID"
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleSubmit} 
              className="bg-primary hover:bg-primary/90 transition"
            >
              Continue to Payment Form
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParentIdDialog;
