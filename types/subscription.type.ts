// Subscription Type based on the response structure provided
export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  type: SubscriptionType;
  meta: Record<string, unknown> | null;
  discount: number | null;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionType = 'FULL_YEAR' | 'HALF_YEAR' | 'MONTHLY' | 'WEEKLY';

export interface CreateSubscriptionRequest {
  name: string;
  description: string;
  price: number;
  type: SubscriptionType;
  discount?: number | null;
  duration: number;
  meta?: Record<string, unknown>;
}

export interface UpdateSubscriptionRequest extends Partial<CreateSubscriptionRequest> {
  id: string;
}

export interface SubscriptionResponse {
  success: boolean;
  data?: Subscription[];
  message: string;
}

export interface SingleSubscriptionResponse {
  success: boolean;
  data?: Subscription;
  message: string;
}
