// Community Dashboard Types

export interface TrendData {
  percentage: number;
  direction: "up" | "down";
}

export interface CountWithTrend {
  count: number;
  trend: TrendData;
}

export interface DashboardStats {
  totalMembers: CountWithTrend;
  activeUsers: {
    today: CountWithTrend;
    thisWeek: CountWithTrend;
  };
  posts: {
    total: number;
    today: number;
    thisWeek: number;
    trend: TrendData;
  };
  comments: {
    total: number;
    today: number;
    thisWeek: number;
    trend: TrendData;
  };
  reports: {
    totalPending: number;
    urgent: number;
    highPriority: number;
    mediumPriority: number;
  };
}

export interface CategoryData {
  id: string;
  name: string;
  iconUrl: string;
  postCount: number;
  percentage?: number;
}

export interface CategoryChartData extends CategoryData {
  percentage: number;
}

export interface TrendingDiscussion {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  categoryIcon?: string;
  comments: number;
  likes?: number;
  shares?: number;
  views?: number;
  engagementScore: number;
  createdAt?: string;
  isTrending: boolean;
}

export interface UserAnalytics {
  activeUsers: {
    daily: CountWithTrend;
    weekly: CountWithTrend;
  };
  growthTrends: {
    newParents: CountWithTrend;
    returningParents: CountWithTrend;
    newVsReturningRatio: number;
  };
  retentionRate: {
    day1: number;
    day7: number;
    day30: number;
    average: number;
    trend?: TrendData;
  };
  engagementScore: {
    averagePostsPerUser: number;
    averageCommentsPerUser: number;
    totalEngagementScore: number;
    trend?: TrendData;
  };
}

export interface Report {
  id: string;
  post: {
    id: string;
    title: string;
    content: string;
    author: string;
    status: string;
  };
  reporter: string;
  reason: string;
  priorityLevel: number;
  status: string;
  assignedModerator?: string;
  isUrgent: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ReportsResponse {
  reports: Report[];
  pagination: PaginationMeta;
}

export interface CategoryEngagement {
  id: string;
  name: string;
  iconUrl: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    totalEngagement: number;
  };
  trend: TrendData;
}

export interface CategoryAnalyticsResponse {
  chart: CategoryChartData[];
  engagement: CategoryEngagement[];
}

export interface CommunityDashboardResponse {
  totalMembers: CountWithTrend;
  activeUsers: {
    today: CountWithTrend;
    thisWeek: CountWithTrend;
  };
  posts: {
    total: number;
    today: number;
    thisWeek: number;
    trend: TrendData;
  };
  comments: {
    total: number;
    today: number;
    thisWeek: number;
    trend: TrendData;
  };
  reports: {
    totalPending: number;
    urgent: number;
    highPriority: number;
    mediumPriority: number;
  };
  topCategories: CategoryData[];
  categoryChart: CategoryChartData[];
  trendingDiscussions: TrendingDiscussion[];
  userAnalytics: UserAnalytics;
}
