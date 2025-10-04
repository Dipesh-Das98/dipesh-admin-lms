"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { TipForm } from "../(routes)/components/tip-form";
import { useRouter } from "next/navigation";

export default function AddTipPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/dashboard/community/tip");
  };

  const handleCancel = () => {
    router.push("/dashboard/community/tip");
  };

  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Tip</h1>
        <p className="text-muted-foreground">
          Fill in the details to create a new educational tip.
        </p>
      </div>

      <TipForm
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </ContentLayout>
  );
}
