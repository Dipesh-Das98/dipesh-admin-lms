"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  RotateCcw,
  BarChart3,
} from "lucide-react";
import { UserAnalytics } from "@/types/community-dashboard.type";
import { cn } from "@/lib/utils";

interface UserAnalyticsProps {
  analytics: UserAnalytics;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    percentage: number;
    direction: "up" | "down";
  };
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const MetricCard = ({
  title,
  value,
  trend,
  icon: Icon,
  description,
}: MetricCardProps) => {
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
        <div className="text-2xl font-bold">{value}</div>
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

const RetentionCard = ({ analytics }: { analytics: UserAnalytics }) => {
  const retentionData = [
    {
      label: "Day 1",
      value: analytics.retentionRate.day1,
      color: "bg-green-500",
    },
    {
      label: "Day 7",
      value: analytics.retentionRate.day7,
      color: "bg-blue-500",
    },
    {
      label: "Day 30",
      value: analytics.retentionRate.day30,
      color: "bg-orange-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          User Retention
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {retentionData.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-medium">
                {(item.value * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={item.value * 100} className="h-2" />
          </div>
        ))}
        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm font-medium">
            <span>Average Retention</span>
            <span>{(analytics.retentionRate.average * 100).toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EngagementCard = ({ analytics }: { analytics: UserAnalytics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Engagement Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {analytics.engagementScore.averagePostsPerUser}
            </div>
            <div className="text-xs text-muted-foreground">Avg Posts/User</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {analytics.engagementScore.averageCommentsPerUser}
            </div>
            <div className="text-xs text-muted-foreground">
              Avg Comments/User
            </div>
          </div>
        </div>
        <div className="text-center pt-2 border-t">
          <div className="text-lg font-semibold">
            {analytics.engagementScore.totalEngagementScore}
          </div>
          <div className="text-xs text-muted-foreground">
            Total Engagement Score
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const UserAnalyticsComponent = ({ analytics }: UserAnalyticsProps) => {
  return (
    <div className="space-y-6">
      {/* Active Users */}
      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard
          title="Daily Active Users"
          value={analytics.activeUsers.daily.count}
          trend={analytics.activeUsers.daily.trend}
          icon={Users}
          description="Users active today"
        />
        <MetricCard
          title="Weekly Active Users"
          value={analytics.activeUsers.weekly.count}
          trend={analytics.activeUsers.weekly.trend}
          icon={Users}
          description="Users active this week"
        />
      </div>

      {/* Growth Trends */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="New Parents"
          value={analytics.growthTrends.newParents.count}
          trend={analytics.growthTrends.newParents.trend}
          icon={UserPlus}
          description="New parent registrations"
        />
        <MetricCard
          title="Returning Parents"
          value={analytics.growthTrends.returningParents.count}
          trend={analytics.growthTrends.returningParents.trend}
          icon={RotateCcw}
          description="Returning parent users"
        />
        <MetricCard
          title="New vs Returning Ratio"
          value={analytics.growthTrends.newVsReturningRatio.toFixed(2)}
          icon={BarChart3}
          description="Ratio of new to returning users"
        />
      </div>

      {/* Retention and Engagement */}
      <div className="grid gap-4 md:grid-cols-2">
        <RetentionCard analytics={analytics} />
        <EngagementCard analytics={analytics} />
      </div>
    </div>
  );
};
