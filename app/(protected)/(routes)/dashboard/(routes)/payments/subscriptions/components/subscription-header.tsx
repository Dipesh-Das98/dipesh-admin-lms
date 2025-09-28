"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { CreateSubscriptionRequest, SubscriptionType } from "@/types/subscription.type";
import { SubscriptionForm } from "./subscription-form";

interface SubscriptionHeaderProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  createForm: UseFormReturn<CreateSubscriptionRequest>;
  handleCreate: (data: CreateSubscriptionRequest) => void;
  isPending: boolean;
  subscriptionTypes: { value: SubscriptionType; label: string }[];
}

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  createForm,
  handleCreate,
  isPending,
  subscriptionTypes,
}) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold">Subscription Plans</h1>
      <p className="text-muted-foreground">
        Manage your subscription plans and pricing
      </p>
    </div>
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Subscription</DialogTitle>
          <DialogDescription>
            Add a new subscription plan to your platform.
          </DialogDescription>
        </DialogHeader>
        <SubscriptionForm
          form={createForm}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateDialogOpen(false)}
          isPending={isPending}
          subscriptionTypes={subscriptionTypes}
          submitLabel="Create"
        />
      </DialogContent>
    </Dialog>
  </div>
);

export default SubscriptionHeader;
