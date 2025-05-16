import axios from "axios";
import { CreateHotelRoom, HotelRoom } from "../interfaces/HotelRoom";
import { API_BASE_URL } from "../data/constants";

const getRoomById = async (token: string, roomId: string) => {
  return axios.get(`${API_BASE_URL}/ede-api/v1/hotel-rooms/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getFilteredRooms = async (
  token: string,
  category?: string,
  available?: boolean
) => {
  return axios.get<HotelRoom[]>(
    `${API_BASE_URL}/ede-api/v1/hotel-rooms/filter`,
    {
      params: {
        ...(category && { category }),
        ...(available !== undefined && { available }),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getAllRooms = async (token: string) => {
  return axios.get<HotelRoom[]>(`${API_BASE_URL}/ede-api/v1/hotel-rooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllAvailableRooms = async (token: string) => {
  return axios.get<HotelRoom[]>(
    `${API_BASE_URL}/ede-api/v1/hotel-rooms/available`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getAllRoomsByCategory = async (token: string, category: string) => {
  return axios.get<HotelRoom[]>(
    `${API_BASE_URL}/ede-api/v1/hotel-rooms/category/${category}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const createRoom = async (token: string, newRoom: CreateHotelRoom) => {
  return axios.post(`${API_BASE_URL}/ede-api/v1/hotel-rooms`, newRoom, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateRoom = async (
  token: string,
  roomId: string,
  updatedRoom: CreateHotelRoom
) => {
  return axios.put(
    `${API_BASE_URL}/ede-api/v1/hotel-rooms/${roomId}`,
    updatedRoom,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteRoom = async (token: string, roomId: string) => {
  return axios.delete(`${API_BASE_URL}/ede-api/v1/hotel-rooms/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAvailableRoomsOnDate = async (token: string, date: string) => {
  return axios.get<HotelRoom[]>(
    `${API_BASE_URL}/ede-api/v1/hotel-rooms/available-on-date`,
    {
      params: {
        date,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getAvailableRoomsBetweenDates = async (token: string, startDate: string, endDate: string) => {
  return axios.get<HotelRoom[]>(
    `${API_BASE_URL}/ede-api/v1/hotel-rooms/available-between-dates`,
    {
      params: {
        startDate,
        endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const HotelRoomService = {
  getRoomById,
  getFilteredRooms,
  getAllRooms,
  getAllAvailableRooms,
  getAllRoomsByCategory,
  createRoom,
  updateRoom,
  deleteRoom,
  getAvailableRoomsOnDate,
  getAvailableRoomsBetweenDates,
};
