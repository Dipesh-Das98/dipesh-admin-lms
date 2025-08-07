import { Subscription, SubscriptionType } from "./subscription.type";

export interface Payment {
  id: string;
  parentId: string;
  transactionId: string;
  status: PaymentStatus;
  childPlans: ChildPlan[];
  amount: number;
  meta: null | Record<string, unknown>;
  submittedAt?: Date;
  verifiedAt: null;
  createdAt: Date;
  updatedAt: Date;
}
export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export interface ChildPlan {
  planId: string;
  childId: string;
  planType: SubscriptionType;
}

export interface CreateManullPaymentRequest {
  parentId: string;
  childPlans: ChildPlan[];
  status: PaymentStatus;
}

export interface UpdatePaymentRequest {
  status: PaymentStatus;
}
export interface PaymentResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

export type PaymentApiResponse = {
  success: boolean;
  data: {
    payments: Payment[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};
export type PayementFilters = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: PaymentStatus;
};
export interface childWithSubscrption {
  nickname: string;
  avatar: string;
  id: string;
  subscription: Subscription | null;
  hasSubscription: boolean;
}

export interface ChildSubscriptionResponse {
  success: boolean;
  children?: childWithSubscrption[];
  availablePlans?: Subscription[];
  message?: string;
}
