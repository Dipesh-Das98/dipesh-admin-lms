import React from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import AdsForm from "../components/ads-form";

const page = () => {
  return (
    <ContentLayout>
      <AdsForm />
    </ContentLayout>
  );
};

export default page;
