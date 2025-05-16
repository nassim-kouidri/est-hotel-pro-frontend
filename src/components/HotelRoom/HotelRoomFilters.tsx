import { Select } from "@chakra-ui/react";
import { useForm, useWatch } from "react-hook-form";
import {
  AVAILABLE,
  CATEGORIES_ROOM,
  CATEGORY_ROOM_LABELS,
  RESERVED,
} from "../../data/HotelRoom";
import { useEffect } from "react";

export type SelectedHotelRoomFilters = {
  categoryRoom: string;
  roomStatus?: string;
};

interface IHotelRoomFiltersFormValues {
  categoryRoom: string;
  roomStatus: string;
}

type HotelRoomFiltersProps = {
  sendFilters: (filters: SelectedHotelRoomFilters) => void;
};

const HotelRoomFilters = ({ sendFilters }: HotelRoomFiltersProps) => {
  const { register, control, handleSubmit } =
    useForm<IHotelRoomFiltersFormValues>();

  const watchedFileds = useWatch({ control });

  useEffect(() => {
    if (watchedFileds) {
      handleSubmit((data) => handleFilters(data))();
    }
  }, [watchedFileds, handleSubmit]);

  const handleFilters = (data: IHotelRoomFiltersFormValues) => {
    sendFilters(data);
  };

  return (
    <form>
      <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
        <Select
          {...register("roomStatus")}
          placeholder={"Sélectionner un statut"}
          focusBorderColor="primary.300"
          size="md"
          bg="white"
        >
          <option value={RESERVED}>{"Réservée"}</option>
          <option value={AVAILABLE}>{"Libre"}</option>
        </Select>
        <Select
          {...register("categoryRoom")}
          placeholder={"Sélectionner une catégorie"}
          focusBorderColor="primary.300"
          size="md"
          bg="white"
        >
          {CATEGORIES_ROOM.map((category) => (
            <option value={category} key={category}>
              {CATEGORY_ROOM_LABELS[category]}
            </option>
          ))}
        </Select>
      </div>
    </form>
  );
};

export default HotelRoomFilters;
