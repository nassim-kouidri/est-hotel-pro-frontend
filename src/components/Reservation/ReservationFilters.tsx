import { Select } from "@chakra-ui/react";
import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { HotelRoom } from "../../interfaces/HotelRoom";
import {
  RESERVATION_STATUS,
  RESERVATION_STATUS_LABELS,
} from "../../data/Reservation";
import { CATEGORY_ROOM_LABELS } from "../../data/HotelRoom";

export type SelectedReservationFilters = {
  status: string;
  hotelRoomId: string;
};

interface IReservationFiltersFormValues {
  status: string;
  hotelRoomId: string;
}

type ReservationFiltersProps = {
  hotelRooms: HotelRoom[];
  sendFilters: (filters: SelectedReservationFilters) => void;
};

const ReservationFilters = ({
  hotelRooms,
  sendFilters,
}: ReservationFiltersProps) => {
  const { register, control, handleSubmit } =
    useForm<IReservationFiltersFormValues>();

  const watchedFileds = useWatch({ control });

  useEffect(() => {
    if (watchedFileds) {
      handleSubmit((data) => handleFilters(data))();
    }
  }, [watchedFileds, handleSubmit]);

  const handleFilters = (data: IReservationFiltersFormValues) => {
    sendFilters(data);
  };

  return (
    <form>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Select
          {...register("status")}
          placeholder={"Sélectionner un statut"}
          focusBorderColor="primary.300"
          size="md"
          bg="white"
        >
          {RESERVATION_STATUS.map((status) => (
            <option key={status} value={status}>
              {RESERVATION_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
        <Select
          {...register("hotelRoomId")}
          placeholder={"Sélectionner une chambre"}
          focusBorderColor="primary.300"
          size="md"
          bg="white"
        >
          {hotelRooms.map((hotelRoom) => (
            <option key={hotelRoom.id} value={hotelRoom.id}>
              {`n°${hotelRoom.roomNumber} (${
                CATEGORY_ROOM_LABELS[hotelRoom.category]
              })`}
            </option>
          ))}
        </Select>
      </div>
    </form>
  );
};

export default ReservationFilters;
