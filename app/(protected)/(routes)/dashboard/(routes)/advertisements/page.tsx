import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import React from "react";
import DataTableWrapper from "./components/data-table-wrapper";

const AdvertisementPage = () => {
  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Advertisement Management</h1>
        <p className="text-muted-foreground text-sm">
          Manage Ads and organize your advertisements by
          <span className="font-semibold"> category</span>. You can create, edit,
          and delete advertisements, as well as filter and sort them by various
          criteria. Use the search bar to quickly find specific advertisements.
        </p>
      </div>

      <DataTableWrapper />
    </ContentLayout>
  );
};

export default AdvertisementPage;
