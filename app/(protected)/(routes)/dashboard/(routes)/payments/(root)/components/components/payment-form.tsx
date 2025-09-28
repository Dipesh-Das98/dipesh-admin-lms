"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { User, Crown, Calendar, DollarSign, Users } from "lucide-react";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentStatus, ChildSubscriptionResponse } from "@/types";
import { CreatePaymentSchema, createPaymentSchema } from "@/schema";
import { createPayment } from "@/actions/dashboard/payment/create-payment";
import UserAvatar from "@/components/ui/user-avatar";

interface PaymentFormProps {
  data: ChildSubscriptionResponse;
  parentId: string;
}
const PaymentForm = ({ data, parentId }: PaymentFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // -------- Form
  const form = useForm<CreatePaymentSchema>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      parentId: parentId,
      status: PaymentStatus.COMPLETED,
      childPlans:
        data?.children?.map((plan) => ({
          childId: plan.id,
          planType: "FULL_YEAR",
          planId: "",
        })) || [],
    },
  });
  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "childPlans",
  });
  // -------- Create Payment Mutation
  const createPaymentMutation = useMutation({
    mutationFn: (data: CreatePaymentSchema) => createPayment(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Payment created successfully!");
        queryClient.invalidateQueries({
          queryKey: ["payments", "payment", "parent", parentId],
        });
        router.push("/dashboard/payments");
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Create payment error:", error);
      toast.error("Failed to create payment. Please try again.");
    },
  });

  const onSubmit = (data: CreatePaymentSchema) => {
    console.log("Submitting payment data:", data);
    createPaymentMutation.mutate(data);
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 rounded-lg p-6 shadow-sm border border-border"
        >
          <div className="space-y-2 pb-6 border-b border-border/50">
            <h2 className="text-2xl font-bold text-foreground">
              Create Payment
            </h2>
            <p className="text-sm text-muted-foreground">
              Set up subscription payments for children accounts
            </p>
          </div>
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Parent Account ID
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the parent's unique ID to link accounts"
                    {...field}
                    className={`h-12 border-border/50 transition-colors duration-200 focus:ring-2 focus:ring-primary/20 ${
                      parentId
                        ? "bg-muted/50 text-muted-foreground"
                        : "bg-background/50 focus:bg-background"
                    }`}
                    readOnly={!!parentId}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
                {parentId && (
                  <p className="text-xs text-green-600/80 bg-green-50/50 dark:bg-green-950/30 rounded-md px-3 py-2 border border-green-200/50 dark:border-green-800/50">
                    ✓ This child will be linked to the selected parent account
                  </p>
                )}
                {!parentId && (
                  <p className="text-xs text-muted-foreground/80 bg-muted/30 rounded-md px-3 py-2">
                    🔗 This connects the child to their parent&apos;s account
                    for communication and monitoring
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Acrtive status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Payment Status
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-12 bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PaymentStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Children and Plan Selection Section */}
          {data?.children && data.children.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="p-2 rounded-lg bg-muted">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Children & Subscription Plans
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select subscription plans for each child account
                  </p>
                </div>
              </div>

              <div className="grid gap-6">
                {fields.map((field, index) => {
                  const child = data.children?.find(
                    (c) => c.id === field.childId
                  );
                  if (!child) return null;

                  return (
                    <Card
                      key={field.id}
                      className="relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm"
                    >
                      {/* No background gradient */}

                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <UserAvatar
                              imageUrl={child.avatar || ""}
                              fallback={child.nickname?.charAt(0) || "C"}
                              alt={child.nickname || "Child Avatar"}
                            />
                            {child.subscription && (
                              <div className="absolute -bottom-1 -right-1 bg-green-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center border border-background">
                                <Crown className="w-3 h-3" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                              {child.nickname}
                              {child.subscription && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  Active
                                </Badge>
                              )}
                            </CardTitle>
                            <div className="flex items-center gap-3 mt-2">
                              {" "}
                              <Badge variant="secondary" className="text-xs">
                                <User className="w-3 h-3 mr-1" />
                                Child Account
                              </Badge>
                              {!child.subscription && (
                                <Badge variant="outline" className="text-xs">
                                  No active subscription
                                </Badge>
                              )}
                            </div>
                          </div>

                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-muted-foreground hover:text-destructive h-8 w-8 p-0 rounded-full"
                              title="Remove child"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Plan Selection */}
                        <FormField
                          control={form.control}
                          name={`childPlans.${index}.planId`}
                          render={({ field: planIdField }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                Available Plans
                              </FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  planIdField.onChange(value);
                                  field.planType =
                                    data.availablePlans?.find(
                                      (plan) => plan.id === value
                                    )?.type || "FULL_YEAR";
                                }}
                                defaultValue={planIdField.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Select a subscription plan" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-72">
                                  <div className="pb-2 px-2">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                      Annual Plans
                                    </p>
                                    {data.availablePlans
                                      ?.filter(
                                        (plan) => plan.type === "FULL_YEAR"
                                      )
                                      .map((plan) => (
                                        <SelectItem
                                          key={plan.id}
                                          value={plan.id}
                                        >
                                          <div className="flex items-center justify-between w-full">
                                            <div className="flex items-start gap-2">
                                              <Crown className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                              <div className="flex flex-col">
                                                <span className="font-medium">
                                                  {plan.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  {plan.description}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4 shrink-0">
                                              {plan.discount && (
                                                <Badge
                                                  variant="destructive"
                                                  className="text-xs"
                                                >
                                                  {plan.discount}% OFF
                                                </Badge>
                                              )}
                                              <span className="font-semibold text-green-600">
                                                Br {plan.price}
                                              </span>
                                            </div>
                                          </div>
                                        </SelectItem>
                                      ))}
                                  </div>

                                  <div className="pt-2 pb-2 px-2 border-t border-border/30">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                      6-Month Plans
                                    </p>
                                    {data.availablePlans
                                      ?.filter(
                                        (plan) => plan.type === "HALF_YEAR"
                                      )
                                      .map((plan) => (
                                        <SelectItem
                                          key={plan.id}
                                          value={plan.id}
                                        >
                                          <div className="flex items-center justify-between w-full">
                                            <div className="flex items-start gap-2">
                                              <Calendar className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                              <div className="flex flex-col">
                                                <span className="font-medium">
                                                  {plan.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  {plan.description}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4 shrink-0">
                                              {plan.discount && (
                                                <Badge
                                                  variant="destructive"
                                                  className="text-xs"
                                                >
                                                  {plan.discount}% OFF
                                                </Badge>
                                              )}
                                              <span className="font-semibold text-green-600">
                                                Br {plan.price}
                                              </span>
                                            </div>
                                          </div>
                                        </SelectItem>
                                      ))}
                                  </div>

                                  {data.availablePlans?.some(
                                    (plan) => plan.type === "MONTHLY"
                                  ) && (
                                    <div className="pt-2 pb-2 px-2 border-t border-border/30">
                                      <p className="text-xs font-medium text-muted-foreground mb-2">
                                        Monthly Plans
                                      </p>
                                      {data.availablePlans
                                        ?.filter(
                                          (plan) => plan.type === "MONTHLY"
                                        )
                                        .map((plan) => (
                                          <SelectItem
                                            key={plan.id}
                                            value={plan.id}
                                          >
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-start gap-2">
                                                <Calendar className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                <div className="flex flex-col">
                                                  <span className="font-medium">
                                                    {plan.name}
                                                  </span>
                                                  <span className="text-xs text-muted-foreground">
                                                    {plan.description}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2 ml-4 shrink-0">
                                                {plan.discount && (
                                                  <Badge
                                                    variant="destructive"
                                                    className="text-xs"
                                                  >
                                                    {plan.discount}% OFF
                                                  </Badge>
                                                )}
                                                <span className="font-semibold text-green-600">
                                                  Br {plan.price}
                                                </span>
                                              </div>
                                            </div>
                                          </SelectItem>
                                        ))}
                                    </div>
                                  )}

                                  {data.availablePlans?.some(
                                    (plan) => plan.type === "WEEKLY"
                                  ) && (
                                    <div className="pt-2 pb-2 px-2 border-t border-border/30">
                                      <p className="text-xs font-medium text-muted-foreground mb-2">
                                        Weekly Plans
                                      </p>
                                      {data.availablePlans
                                        ?.filter(
                                          (plan) => plan.type === "WEEKLY"
                                        )
                                        .map((plan) => (
                                          <SelectItem
                                            key={plan.id}
                                            value={plan.id}
                                          >
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-start gap-2">
                                                <Calendar className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                                <div className="flex flex-col">
                                                  <span className="font-medium">
                                                    {plan.name}
                                                  </span>
                                                  <span className="text-xs text-muted-foreground">
                                                    {plan.description}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2 ml-4 shrink-0">
                                                {plan.discount && (
                                                  <Badge
                                                    variant="destructive"
                                                    className="text-xs"
                                                  >
                                                    {plan.discount}% OFF
                                                  </Badge>
                                                )}
                                                <span className="font-semibold text-green-600">
                                                  Br {plan.price}
                                                </span>
                                              </div>
                                            </div>
                                          </SelectItem>
                                        ))}
                                    </div>
                                  )}

                                  {!data.availablePlans?.length && (
                                    <SelectItem value="" disabled>
                                      No plans available
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Total Summary */}
              {fields.some((field) =>
                form.watch(`childPlans.${fields.indexOf(field)}.planId`)
              ) && (
                <Card className="overflow-hidden">
                  {/* No background gradient */}
                  <CardContent className="py-6 relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary shadow-sm">
                            <DollarSign className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <h4 className="text-xl font-semibold text-foreground">
                            Payment Summary
                          </h4>
                        </div>

                        <div className="mt-4 space-y-2">
                          {fields.map((field, index) => {
                            const planId = form.watch(
                              `childPlans.${index}.planId`
                            );
                            if (!planId) return null;

                            const plan = data.availablePlans?.find(
                              (p) => p.id === planId
                            );
                            const child = data.children?.find(
                              (c) => c.id === field.childId
                            );

                            if (!plan || !child) return null;

                            return (
                              <div
                                key={field.id}
                                className="flex items-center justify-between py-2 border-b border-border/30 last:border-none"
                              >
                                <div className="flex items-center gap-2">
                                  <UserAvatar
                                    imageUrl={child.avatar || ""}
                                    fallback={child.nickname?.charAt(0) || "C"}
                                    alt={child.nickname || "Child Avatar"}
                                  />
                                  <div>
                                    <p className="text-sm font-medium">
                                      {child.nickname}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {plan.name}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-semibold">
                                  Br {plan.price.toFixed(2)}
                                </p>
                              </div>
                            );
                          })}

                          <div className="flex items-center justify-between pt-4 mt-2 border-t border-border">
                            <p className="font-medium text-sm">
                              Subtotal (
                              {
                                fields.filter((field, index) =>
                                  form.watch(`childPlans.${index}.planId`)
                                ).length
                              }{" "}
                              items)
                            </p>
                            <p className="font-semibold">
                              Br
                              {fields
                                .reduce((total, field, index) => {
                                  const planId = form.watch(
                                    `childPlans.${index}.planId`
                                  );
                                  if (!planId) return total;
                                  const plan = data.availablePlans?.find(
                                    (p) => p.id === planId
                                  );
                                  return total + (plan?.price || 0);
                                }, 0)
                                .toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg border border-border shadow-sm text-right">
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Amount
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          Br{" "}
                          {fields
                            .reduce((total, field, index) => {
                              const planId = form.watch(
                                `childPlans.${index}.planId`
                              );
                              if (!planId) return total;
                              const plan = data.availablePlans?.find(
                                (p) => p.id === planId
                              );
                              return total + (plan?.price || 0);
                            }, 0)
                            .toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Includes all subscriptions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {(!data?.children || data.children.length === 0) && (
            <Card className="bg-muted/30 border-dashed border-2 border-muted-foreground/20">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No Children Found
                </h3>
                <p className="text-sm text-muted-foreground/80 max-w-md">
                  No children are available for subscription. Please ensure the
                  parent account has registered children.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-4 pt-6 border-t border-border/50">
            <Button
              type="submit"
              disabled={
                createPaymentMutation.isPending ||
                !fields.some((field, index) =>
                  form.watch(`childPlans.${index}.planId`)
                )
              }
              className="flex-1 h-12 font-semibold shadow-sm"
            >
              {createPaymentMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Create Payment
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentForm;
