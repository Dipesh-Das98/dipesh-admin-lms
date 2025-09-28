"use client";

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSubscriptions } from "@/hooks/use-subscriptions";
import { createSubscription } from "@/actions/dashboard/subscription/create-subscription";
import { updateSubscription } from "@/actions/dashboard/subscription/update-subscription";
import { deleteSubscription } from "@/actions/dashboard/subscription/delete-subscription";

import {
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  Subscription,
  SubscriptionType,
} from "@/types/subscription.type";
import {
  createSubscriptionSchema,
} from "@/schema/subscription-schema";
 
import SubscriptionHeader from "./subscription-header";
import SubscriptionTable from "./subscription-table";
import SubscriptionFilterBar from "./subscription-filter-bar";
import EditSubscriptionDialog from "./edit-subscription-dialog";

import DashboardLoadingPage from "../../../(root)/loading";

const subscriptionTypes: { value: SubscriptionType; label: string }[] = [
  //{ value: "WEEKLY", label: "Weekly" },
  //{ value: "MONTHLY", label: "Monthly" },
  { value: "HALF_YEAR", label: "Half Year" },
  { value: "FULL_YEAR", label: "Full Year" },
];

const SubscriptionPageWrapper = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<SubscriptionType | "all">("all");

  const queryClient = useQueryClient();
  const { data: subscriptionsData, isLoading, error } = useSubscriptions();

  const createForm = useForm<CreateSubscriptionRequest>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      type: "MONTHLY",
      discount: null,
      duration: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: createSubscription,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setIsCreateDialogOpen(false);
        createForm.reset();
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create subscription");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSubscription,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setEditingSubscription(null);
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update subscription");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubscription,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete subscription");
    },
  });

  const handleCreate = (data: CreateSubscriptionRequest) => {
    createMutation.mutate(data);
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
  };

  const handleUpdate = (data: UpdateSubscriptionRequest) => {
    updateMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredSubscriptions =
    subscriptionsData?.data?.filter((subscription) => {
      const matchesSearch =
        subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" || subscription.type === filterType;
      return matchesSearch && matchesType;
    }) || [];

  if (isLoading) {
    return (
      <DashboardLoadingPage/>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error loading subscriptions</div>
      </div>
    );
  }

  return (
    
      <div className="container mx-auto p-6 space-y-6">
        <SubscriptionHeader
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          createForm={createForm}
          handleCreate={handleCreate}
          isPending={createMutation.isPending}
          subscriptionTypes={subscriptionTypes}
        />

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionFilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              subscriptionTypes={subscriptionTypes}
            />
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Subscription Plans ({filteredSubscriptions.length})
            </CardTitle>
            <CardDescription>
              Manage and configure your subscription plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Subscriptions Table */}
            <SubscriptionTable
              subscriptions={filteredSubscriptions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchTerm={searchTerm}
              filterType={filterType}
              subscriptionTypes={subscriptionTypes}
            />
          </CardContent>
        </Card>

        <EditSubscriptionDialog
          isOpen={!!editingSubscription}
          onOpenChange={(open) => !open && setEditingSubscription(null)}
          subscription={editingSubscription}
          onConfirm={handleUpdate}
          isPending={updateMutation.isPending}
          subscriptionTypes={subscriptionTypes}
        />
      </div>

  );
};

export default SubscriptionPageWrapper;
