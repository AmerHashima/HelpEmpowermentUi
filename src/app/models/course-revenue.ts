export enum RevenueCalculationType {
  Percentage = 0,
  FixedAmount = 1
}

export interface CourseRevenueShare {
  oid: string;
  courseId: string;
  userId: string | null;
  userName: string | null;
  shareTypeId: string;
  shareType: string;
  calculationType: RevenueCalculationType;
  value: number;
  isActive: boolean;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  notes: string | null;
}

export interface SaveCourseRevenueShare {
  beneficiaryUserId: string | null;
  shareTypeId: string;
  calculationType: RevenueCalculationType;
  value: number;
  isActive: boolean;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  notes: string | null;
}

export interface RevenueShareBreakdown {
  userId: string | null;
  userName: string | null;
  type: string;
  percentage: number | null;
  amount: number;
  pending: number;
  paid: number;
}

export interface CourseRevenueSummary {
  courseId: string;
  totalRevenue: number;
  distributedRevenue: number;
  pendingRevenue: number;
  paidRevenue: number;
  shares: RevenueShareBreakdown[];
}
