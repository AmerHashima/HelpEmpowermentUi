export enum RevenueSettlementStatus { Draft = 0, Approved = 1, Paid = 2, Cancelled = 3 }
export interface RevenueSettlement { oid: string; beneficiaryUserId: string; beneficiaryName: string; settlementNumber: string; periodFrom: string; periodTo: string; totalAmount: number; status: RevenueSettlementStatus; paidAt: string | null; paymentReference: string | null; notes: string | null; }
export interface CreateRevenueSettlement { beneficiaryUserId: string; periodFrom: string; periodTo: string; notes: string | null; }
export interface UpdateRevenueSettlementStatus { status: RevenueSettlementStatus; paymentReference: string | null; }
export interface SettlementBeneficiary { oid: string; username: string; email: string; isActive: boolean; }
