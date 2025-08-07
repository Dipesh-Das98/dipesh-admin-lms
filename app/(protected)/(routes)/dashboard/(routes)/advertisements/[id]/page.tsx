import React from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import AdsForm from "../components/ads-form";
import { getAdById } from "@/actions/dashboard/ads/get-ads-by-id";
import { redirect } from "next/navigation";
import AddBanner from "./component/add-banner-image";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}
const page = async ({ params }: PageProps) => {
  const { id } = await params;
  const ads = await getAdById(id);
  if (!ads.success || !ads.data) {
    redirect("/dashboard/advertisements");
  }
  return (
    <ContentLayout
      className="space-y-6"
      breadcrumbItems={[
        {
          label: "Advertisements",
          href: "/dashboard/advertisements",
        },
        {
          label: "Edit Advertisement",
          href: `/dashboard/advertisements/${ads.data.id}/edit`,
        },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdsForm initialData={ads.data} type="edit" />
        <AddBanner initialData={ads.data} />
      </div>
    </ContentLayout>
  );
};

export default page;
