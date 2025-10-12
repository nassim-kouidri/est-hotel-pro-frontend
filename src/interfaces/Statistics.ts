// Statistics DTO interfaces aligned with backend contracts
// These are initial skeletons and may evolve as we integrate the UI components.

export interface OverviewStatsResponse {
  totalReservations: number;
  revenue: number;
  occupiedRoomNights: number;
  roomCapacityNights: number;
  occupancyRate: number; // 0..1
  adr: number;
  revpar: number;
  avgLengthOfStay: number;
  contractedShare: number; // 0..1
  contractedRevenue: number;
}

export interface DailyOccupancyPoint {
  date: string; // ISO YYYY-MM-DD
  occupiedRoomNights: number;
  occupancyRate: number; // 0..1
}

export interface DailyReservationPoint {
  date: string; // ISO YYYY-MM-DD
  reservations: number;
  revenue: number;
}

export interface CategorySlice {
  category: string;
  roomNights: number;
  reservations: number;
}

export type PaymentStatus = "FULLY_PAID" | "PARTIALLY_PAID" | "NOT_PAID";

export interface PaymentStatusSlice {
  paymentStatus: PaymentStatus;
  count: number;
  revenue: number;
}

export interface CompanyTop {
  companyName: string;
  reservations: number;
  revenue: number;
  roomNights: number;
}
