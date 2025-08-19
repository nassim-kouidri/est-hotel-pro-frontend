import { HotelRoom } from "./HotelRoom";

export enum ReservationStatus {
  COMING,
  IN_PROGRESS,
  ENDED,
}

export interface UserSnapshot {
  name: string;
  firstName: string;
  numberPhone: string;
}

export enum PaymentStatus {
  FULLY_PAID = "FULLY_PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  NOT_PAID = "NOT_PAID",
}

export interface CreateReservation {
  roomId: string;
  userSnapshot: UserSnapshot;
  startDate: string;
  endDate: string;
  claim?: string;
  numberOfChildren: number;
  numberOfAdults: number;
  pricePaid: number;
  review?: number;
  isContracted: boolean;
  companyName?: string;
  paymentStatus: PaymentStatus;
  paymentRemark?: string;
}

export interface Reservation {
  id: string;
  userSnapshot: UserSnapshot;
  hotelRoom: HotelRoom;
  startDate: string;
  endDate: string;
  claim: string;
  numberOfChildren: number;
  numberOfAdults: number;
  pricePaid: number;
  review: number;
  status: ReservationStatus;
  isContracted: boolean;
  companyName?: string;
  paymentStatus: PaymentStatus;
  paymentRemark?: string;
}

export interface ReservationChartData {
  id: string;
  startDate: string;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface MonthlyCalendarResponse {
  year: number;
  month: number;
  dailyReservationCounts: Record<string, number>;
}
