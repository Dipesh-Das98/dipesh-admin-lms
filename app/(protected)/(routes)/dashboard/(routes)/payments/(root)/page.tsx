import React from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import DataTableWrapper from "./components/components/data-table-wrapper";

const PaymentPage = () => {
  return (
    <ContentLayout>
      <div>
        <h1 className="text-3xl font-bold">Payments Management</h1>
        <p className="text-muted-foreground">
          Manage Payment and Subscription plans for parents and children
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
};

export default PaymentPage;
