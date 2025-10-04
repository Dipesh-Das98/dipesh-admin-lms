"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Report } from "@/types/community-dashboard.type";
import { cn } from "@/lib/utils";

interface ReportsSectionProps {
  reports: Report[];
  totalPending: number;
  urgent: number;
  highPriority: number;
  mediumPriority: number;
}

interface ReportCardProps {
  report: Report;
}

const ReportCard = ({ report }: ReportCardProps) => {
  const getPriorityColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-red-100 text-red-800 border-red-200";
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case 3:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Critical";
      case 2:
        return "High";
      case 3:
        return "Medium";
      default:
        return "Low";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm line-clamp-1">
              {report.post.title}
            </h4>
            {report.isUrgent && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgent
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {report.post.content}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>by {report.post.author}</span>
            <span>•</span>
            <span>reported by {report.reporter}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("text-xs", getPriorityColor(report.priorityLevel))}
          >
            {getPriorityLabel(report.priorityLevel)}
          </Badge>
          <Badge
            variant="outline"
            className={cn("text-xs", getStatusColor(report.status))}
          >
            {report.status}
          </Badge>
        </div>

        <Button variant="ghost" size="sm" className="h-6 px-2">
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        <div className="flex items-center gap-1 mb-1">
          <MessageSquare className="h-3 w-3" />
          <span>Reason: {report.reason}</span>
        </div>
        {report.assignedModerator && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>Assigned to: {report.assignedModerator}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const ReportsSection = ({
  reports,
  totalPending,
  urgent,
  highPriority,
  mediumPriority,
}: ReportsSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Reports Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-muted-foreground">
              Reports awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Urgent
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgent}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Priority
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {highPriority}
            </div>
            <p className="text-xs text-muted-foreground">
              High priority reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medium Priority
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mediumPriority}
            </div>
            <p className="text-xs text-muted-foreground">
              Medium priority reports
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No reports at the moment</p>
              </div>
            ) : (
              reports
                .slice(0, 5)
                .map((report) => <ReportCard key={report.id} report={report} />)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
