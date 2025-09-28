"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionForm } from "./subscription-form";

import {
  UpdateSubscriptionRequest,
  Subscription,
  SubscriptionType,
} from "@/types/subscription.type";
import { updateSubscriptionSchema } from "@/schema/subscription-schema";

interface EditSubscriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
  onConfirm: (data: UpdateSubscriptionRequest) => void;
  isPending: boolean;
  subscriptionTypes: { value: SubscriptionType; label: string }[];
}

const EditSubscriptionDialog: React.FC<EditSubscriptionDialogProps> = ({
  isOpen,
  onOpenChange,
  subscription,
  onConfirm,
  isPending,
  subscriptionTypes,
}) => {
  const form = useForm<UpdateSubscriptionRequest>({
    resolver: zodResolver(updateSubscriptionSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: 0,
      type: "MONTHLY",
      discount: null,
      duration: 1,
    },
  });

  useEffect(() => {
    if (subscription) {
      form.reset({
        id: subscription.id,
        name: subscription.name,
        description: subscription.description,
        price: subscription.price,
        type: subscription.type,
        discount: subscription.discount,
        duration: subscription.duration,
      });
    }
  }, [subscription, form]);

  if (!subscription) {
    return null;
  }

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Update the subscription plan details.
          </DialogDescription>
        </DialogHeader>
        <SubscriptionForm
          form={form}
          onSubmit={onConfirm}
          onCancel={handleCancel}
          isPending={isPending}
          subscriptionTypes={subscriptionTypes}
          submitLabel="Update"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriptionDialog; 