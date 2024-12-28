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
}

export interface ReservationChartData {
  id: string;
  startDate: string;
}
