import axios from "axios";
import {
  CreateReservation,
  MonthlyCalendarResponse,
  Page,
  Reservation,
  ReservationChartData,
} from "../interfaces/Reservation";
import { API_BASE_URL } from "../data/constants";

const getReservationById = async (token: string, reservationId: string) => {
  return axios.get(`${API_BASE_URL}/ede-api/v1/reservations/${reservationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllReservations = async (
  token: string,
  page: number = 0,
  size: number = 9,
  status?: string,
  hotelRoomId?: string,
  startDate?: string,
  endDate?: string
) => {
  return axios.get<Page<Reservation>>(
    `${API_BASE_URL}/ede-api/v1/reservations/filter/pageable`,
    {
      params: {
        page,
        size,
        ...(status && { status }),
        ...(hotelRoomId && { hotelRoomId }),
        startDate,
        endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getAllReservationsForChart = async (token: string) => {
  return axios.get<ReservationChartData[]>(
    `${API_BASE_URL}/ede-api/v1/reservations/charts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const createReservation = async (
  token: string,
  newReservation: CreateReservation
) => {
  return axios.post(`${API_BASE_URL}/ede-api/v1/reservations`, newReservation, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateReservation = async (
  token: string,
  reservationId: string,
  updatedReservation: CreateReservation
) => {
  return axios.put(
    `${API_BASE_URL}/ede-api/v1/reservations/${reservationId}`,
    updatedReservation,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteReservation = async (token: string, reservationId: string) => {
  return axios.delete(
    `${API_BASE_URL}/ede-api/v1/reservations/${reservationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getMonthlyCalendar = async (token: string, year: number, month: number) => {
  return axios.get<MonthlyCalendarResponse>(
    `${API_BASE_URL}/ede-api/v1/reservations/calendar/monthly`,
    {
      params: {
        year,
        month,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const ReservationService = {
  getReservationById,
  getAllReservations,
  getAllReservationsForChart,
  createReservation,
  updateReservation,
  deleteReservation,
  getMonthlyCalendar,
};
