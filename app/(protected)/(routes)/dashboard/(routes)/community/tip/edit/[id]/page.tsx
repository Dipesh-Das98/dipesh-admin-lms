"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { TipForm } from "../../(routes)/components/tip-form";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTipById } from "@/actions/dashboard/community/tip";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";

export default function EditTipPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["tip", id],
    queryFn: () => getTipById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const tip = data?.data;

  const handleSuccess = () => {
    router.push("/dashboard/community/tip");
  };

  const handleCancel = () => {
    router.push("/dashboard/community/tip");
  };

  if (isLoading) {
    return (
      <ContentLayout className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Tip</h1>
          <p className="text-muted-foreground">Loading tip details...</p>
        </div>
        <DataTableSkeleton columnCount={1} />
      </ContentLayout>
    );
  }

  if (error || !tip) {
    return (
      <ContentLayout className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Tip</h1>
          <p className="text-muted-foreground">Error loading tip details.</p>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600">
              Tip Not Found
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              The tip you&apos;re looking for doesn&apos;t exist or has been
              deleted.
            </p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Tip</h1>
        <p className="text-muted-foreground">Update the tip details below.</p>
      </div>

      <TipForm
        mode="edit"
        tip={tip}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </ContentLayout>
  );
}
