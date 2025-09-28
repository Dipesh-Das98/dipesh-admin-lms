"use client";
import { redirect, useSearchParams } from "next/navigation";
import useParentSubscription from "@/hooks/use-parent-subscription";

import { LoadingState } from "@/components/ui/loading-state";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";

import PaymentForm from "../components/components/payment-form";
import { ErrorState } from "@/components/ui/error-state";

const AddPayment = () => {
  const params = useSearchParams();

  const parentId = params.get("parentId");

  if (!parentId) {
    redirect("/dashboard/payments");
  }

  const { data, isLoading, isError, refetch } = useParentSubscription(parentId);
  if (isLoading) {
    return (
      <div>
        <LoadingState message="Loading parent subscription details..." />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div>
        <ErrorState
          message="Failed to load parent subscription details. Please try again later."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <ContentLayout
      breadcrumbItems={[
        {
          label: "Payments",
          href: "/dashboard/payments",
        },
        {
          label: "Add Payment",
        },
      ]}
    >
      <PaymentForm data={data} parentId={parentId} />
    </ContentLayout>
  );
};

export default AddPayment;
