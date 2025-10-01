"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardStats } from "@/types/community-dashboard.type";

interface StatsCardsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    percentage: number;
    direction: "up" | "down";
  };
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const StatCard = ({
  title,
  value,
  trend,
  icon: Icon,
  description,
}: StatCardProps) => {
  const isPositive = trend?.direction === "up";
  const isNegative = trend?.direction === "down";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : isNegative ? (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            ) : null}
            <span
              className={cn(
                "font-medium",
                isPositive && "text-green-600",
                isNegative && "text-red-600"
              )}
            >
              {trend.percentage}%
            </span>
            <span className="ml-1">
              {isPositive ? "increase" : isNegative ? "decrease" : ""}
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Members */}
      <StatCard
        title="Total Members"
        value={stats.totalMembers.count}
        trend={stats.totalMembers.trend}
        icon={Users}
        description="Community members"
      />

      {/* Active Users Today */}
      <StatCard
        title="Active Today"
        value={stats.activeUsers.today.count}
        trend={stats.activeUsers.today.trend}
        icon={Users}
        description="Users active today"
      />

      {/* Total Posts */}
      <StatCard
        title="Total Posts"
        value={stats.posts.total}
        trend={stats.posts.trend}
        icon={MessageSquare}
        description={`${stats.posts.today} today, ${stats.posts.thisWeek} this week`}
      />

      {/* Total Comments */}
      <StatCard
        title="Total Comments"
        value={stats.comments.total}
        trend={stats.comments.trend}
        icon={MessageSquare}
        description={`${stats.comments.today} today, ${stats.comments.thisWeek} this week`}
      />

      {/* Pending Reports */}
      <StatCard
        title="Pending Reports"
        value={stats.reports.totalPending}
        icon={AlertTriangle}
        description={`${stats.reports.urgent} urgent, ${stats.reports.highPriority} high priority`}
      />
    </div>
  );
};
