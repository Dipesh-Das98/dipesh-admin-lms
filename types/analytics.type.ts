// Interfaces for the deeply nested Dashboard Content API response

// --- 1. User Summaries ---

export interface TrendData {
  total: number;
  paid: number;
  unpaid: number;
}

export interface UserSubSummary {
  total: number;
  paid: number;
  unpaid: number;
  trends: TrendData;
}

export interface UserSummary {
  parents: UserSubSummary;
  children: UserSubSummary;
}

// --- 2. Active & Registered Users ---

export interface ByDeviceCounts {
  ANDROID: number;
  IOS: number;
  WEB: number;
}

export interface ActiveUsers {
  total: number;
  parents: number;
  children: number;
  byDevice: ByDeviceCounts;
}

export interface RegisteredDeviceDetail {
  count: number;
  percentage: number;
}

export interface RegisteredUsers {
  total: number;
  byDevice: {
    android: RegisteredDeviceDetail;
    ios: RegisteredDeviceDetail;
    web: RegisteredDeviceDetail;
  };
}

export interface ActiveAndRegisteredUsers {
  activeUsers: ActiveUsers;
  registeredUsers: RegisteredUsers;
}

// --- 3. Content Categories ---

export interface AcademicGradeSubjects {
  english: number;
  math: number;
  science: number;
  ethics: number;
}

// Union type to handle the inconsistent structure (Pre-K vs Graded subjects)
export type AcademicGradeContent = 
  | { grade: string; total: number; subjects?: never }
  | { grade: string; total?: never; subjects: AcademicGradeSubjects };

export interface OtherContent {
  stories: number;
  movies: number;
  music: number;
  games: number;
  library: number;
  ethicsCorner: number;
  languageCorner: number;
  variety: number;
  readAlong: number;
}

export interface ContentCategories {
  academic: AcademicGradeContent[];
  other: OtherContent;
}

// --- 4. Parent Categories ---

export interface ParentCategorySummary {
  newVideosThisWeek?: number; // exists in familyHealth
  activeUsersThisWeek?: number; // exists in communityHub/tenaBot
  trend: number;
}

export interface ParentCategories {
  familyHealth: ParentCategorySummary;
  communityHub: ParentCategorySummary;
  tenaBot: ParentCategorySummary;
}

// --- 5. Payments Summary ---

export interface PaymentDetail {
  amount: number;
  count?: number; // only exists for unpaidParents
}

export interface PaymentsBreakdown {
  paidParents: PaymentDetail;
  unpaidParents: PaymentDetail;
  paidChildren: PaymentDetail;
  unpaidChildren: PaymentDetail;
}

export interface PaymentsSummary {
  weeklyTotal: number;
  trend: number;
  transactionCount: number;
  breakdown: PaymentsBreakdown;
}

// --- 6. Advertisements Summary ---

export interface AdvertisementSummary {
  totalActive: number;
  // Use any[] since we don't have the shape of individual advertisements
  advertisements: any[]; 
}

// --- Final Data Structure ---

export interface DashboardContentData {
  userSummary: UserSummary;
  activeAndRegisteredUsers: ActiveAndRegisteredUsers;
  contentCategories: ContentCategories;
  parentCategories: ParentCategories;
  paymentsSummary: PaymentsSummary;
  advertisementsSummary: AdvertisementSummary;
}

// --- API Response Type ---

export interface DashboardContentResponse {
  success: boolean;
  data: DashboardContentData | null;
  message: string;
}
