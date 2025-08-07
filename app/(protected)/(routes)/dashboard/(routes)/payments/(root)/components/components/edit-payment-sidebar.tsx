"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowRight , Check, Clock, XCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePayment } from "@/actions/dashboard/payment/update-payment";
import { useSheet } from "@/hooks/use-sheet";
import {  PaymentStatus } from "@/types";
import { UpdatePaymentSchema, updatePaymentSchema } from "@/schema";
import { useEffect } from "react";

const EditPaymentStatus = () => {
  const { data, isOpen, type, onClose } = useSheet();
  const { payment } = data || {};
  const isOpened = isOpen && type === "payment-form";
  const queryClient = useQueryClient();

  // Create form with zod resolver
  const form = useForm({
    resolver: zodResolver(updatePaymentSchema),
    defaultValues: {
      id: payment?.id || "",
      status: payment?.status || PaymentStatus.PENDING,
    },
  });

  // Update when payment changes (when sheet opens)
  useEffect(() => {
    if (payment) {
      form.reset({
        id: payment.id,
        status: payment.status,
      });
    }
  }, [payment, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
    }
  };

  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: updatePayment,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          response.message || "Payment status updated successfully"
        );
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        onClose();
      } else {
        toast.error(response.message || "Failed to update payment status");
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while updating payment status"
      );
    },
  });

  const onSubmit = (values: UpdatePaymentSchema) => {
    updateStatusMutation.mutate(values);
  };

  // Status options with icons and descriptions
  const statusOptions = [
    {
      value: PaymentStatus.PENDING,
      label: "Pending",
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      description: "Payment is awaiting processing",
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      value: PaymentStatus.COMPLETED,
      label: "Completed",
      icon: <Check className="h-4 w-4 text-green-500" />,
      description: "Payment has been successfully processed",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      value: PaymentStatus.FAILED,
      label: "Failed",
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      description: "Payment processing failed",
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    {
      value: PaymentStatus.REFUNDED,
      label: "Refunded",
      icon: <ArrowRight className="h-4 w-4 text-blue-500" />,
      description: "Payment has been refunded to customer",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      value: PaymentStatus.CANCELLED,
      label: "Cancelled",
      icon: <XCircle className="h-4 w-4 text-gray-500" />,
      description: "Payment has been cancelled",
      color: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
    },
  ];

  // Get current status data
  const currentStatus = statusOptions.find(
    (option) => option.value === form.watch("status")
  );

  return (
    <Sheet open={isOpened} onOpenChange={handleOpenChange}>
      <SheetContent className="w-lg p-4 sm:max-w-[500px]">
        <SheetHeader className="pb-4">
          <SheetTitle>Update Payment Status</SheetTitle>
          <SheetDescription>
            Change the status of payment #{payment?.id?.substring(0, 8)}
          </SheetDescription>
        </SheetHeader>

        {payment && (
          <div className="mt-6 space-y-6">
            {/* Payment Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Payment Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Payment ID</p>
                    <p className="font-mono text-sm truncate">{payment.id}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm">
                      {new Date(payment?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {payment.amount && (
                  <div className="bg-muted/50 p-3 rounded-lg mt-2">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-semibold">${payment.amount}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 ${currentStatus?.color}`}
                >
                  {currentStatus?.icon}
                  {currentStatus?.label || form.watch("status")}
                </div>
                <p className="text-xs text-muted-foreground">Current Status</p>
              </div>
            </div>

            <Separator />

            {/* Status Update Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                {option.icon}
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      "Update Status"
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="rounded-lg bg-muted p-3 mt-4">
              <p className="text-xs text-muted-foreground">
                {currentStatus?.description ||
                  "Change the payment status as needed"}
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EditPaymentStatus;
