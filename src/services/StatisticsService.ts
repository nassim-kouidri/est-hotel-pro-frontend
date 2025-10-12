import axios from "axios";
import { API_BASE_URL } from "../data/constants";
import {
  OverviewStatsResponse,
  DailyOccupancyPoint,
  DailyReservationPoint,
  CategorySlice,
  PaymentStatusSlice,
  CompanyTop,
} from "../interfaces/Statistics";

// Helper to attach Authorization header; you can adapt if there is a centralized axios instance.
const withAuth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const StatisticsService = {
  getOverview: (token: string, startDate: string, endDate: string, signal?: AbortSignal) =>
    axios.get<OverviewStatsResponse>(`${API_BASE_URL}/ede-api/v1/statistics/overview`, {
      params: { startDate, endDate },
      signal,
      ...withAuth(token),
    }),

  getDailyOccupancy: (token: string, startDate: string, endDate: string, signal?: AbortSignal) =>
    axios.get<DailyOccupancyPoint[]>(`${API_BASE_URL}/ede-api/v1/statistics/series/occupancy`, {
      params: { startDate, endDate },
      signal,
      ...withAuth(token),
    }),

  getDailyReservations: (token: string, startDate: string, endDate: string, signal?: AbortSignal) =>
    axios.get<DailyReservationPoint[]>(`${API_BASE_URL}/ede-api/v1/statistics/series/reservations`, {
      params: { startDate, endDate },
      signal,
      ...withAuth(token),
    }),

  getCategorySlice: (token: string, startDate: string, endDate: string, signal?: AbortSignal) =>
    axios.get<CategorySlice[]>(`${API_BASE_URL}/ede-api/v1/statistics/slices/category`, {
      params: { startDate, endDate },
      signal,
      ...withAuth(token),
    }),

  getPaymentStatusSlice: (token: string, startDate: string, endDate: string, signal?: AbortSignal) =>
    axios.get<PaymentStatusSlice[]>(`${API_BASE_URL}/ede-api/v1/statistics/slices/payment-status`, {
      params: { startDate, endDate },
      signal,
      ...withAuth(token),
    }),

  getTopCompanies: (token: string, startDate: string, endDate: string, limit = 5, signal?: AbortSignal) =>
    axios.get<CompanyTop[]>(`${API_BASE_URL}/ede-api/v1/statistics/top/companies`, {
      params: { startDate, endDate, limit },
      signal,
      ...withAuth(token),
    }),
};
