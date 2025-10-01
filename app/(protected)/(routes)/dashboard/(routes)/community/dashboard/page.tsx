"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { useQuery } from "@tanstack/react-query";
import {
  getCommunityDashboard,
  getCommunityReports,
} from "@/actions/dashboard/community/dashboard";
import { StatsCards } from "./(routes)/components/stats-cards";
import { CategoryChart } from "./(routes)/components/category-chart";
import { TrendingDiscussions } from "./(routes)/components/trending-discussions";
import { UserAnalyticsComponent } from "./(routes)/components/user-analytics";
import { ReportsSection } from "./(routes)/components/reports-section";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skleton";
import { ErrorState } from "@/components/ui/error-state";
import { RefreshCw } from "lucide-react";

export default function CommunityDashboardPage() {
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ["community-dashboard"],
    queryFn: () => getCommunityDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: reportsData, refetch: refetchReports } = useQuery({
    queryKey: ["community-reports"],
    queryFn: () => getCommunityReports(1, 10),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = () => {
    refetchDashboard();
    refetchReports();
  };

  if (isDashboardLoading) {
    return (
      <ContentLayout className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Community Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of community activity and analytics
          </p>
        </div>
        <DataTableSkeleton columnCount={4} />
      </ContentLayout>
    );
  }

  if (dashboardError) {
    return (
      <ContentLayout className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Community Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of community activity and analytics
          </p>
        </div>
        <ErrorState
          title="Failed to load dashboard"
          message={
            dashboardError instanceof Error
              ? dashboardError.message
              : "An error occurred"
          }
          onRetry={handleRefresh}
        />
      </ContentLayout>
    );
  }

  const dashboard = dashboardData?.data;
  const reports = reportsData?.data;

  if (!dashboard) {
    return (
      <ContentLayout className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Community Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of community activity and analytics
          </p>
        </div>
        <ErrorState
          title="No data available"
          message="Unable to load dashboard data"
          onRetry={handleRefresh}
        />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Community Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of community activity and analytics
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Main Statistics */}
      <StatsCards stats={dashboard} />

      {/* Charts and Analytics Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Chart */}
        <CategoryChart data={dashboard.categoryChart} />

        {/* Trending Discussions */}
        <TrendingDiscussions discussions={dashboard.trendingDiscussions} />
      </div>

      {/* User Analytics */}
      <UserAnalyticsComponent analytics={dashboard.userAnalytics} />

      {/* Reports Section */}
      {reports && (
        <ReportsSection
          reports={reports.reports}
          totalPending={dashboard.reports.totalPending}
          urgent={dashboard.reports.urgent}
          highPriority={dashboard.reports.highPriority}
          mediumPriority={dashboard.reports.mediumPriority}
        />
      )}
    </ContentLayout>
  );
}
