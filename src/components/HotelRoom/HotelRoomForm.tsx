import { useForm } from "react-hook-form";
import CustomFormControl from "../Form/CustomFormControl";
import CustomInput from "../Form/CustomInput";
import {
  Button,
  InputGroup,
  InputRightElement,
  Select,
  Spacer,
} from "@chakra-ui/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CHAMP_OBLIGATOIRE,
  DZD,
  ENREGISTRER,
  METTRE_A_JOUR,
} from "../../data/constants";
import { CATEGORIES_ROOM, CATEGORY_ROOM_LABELS } from "../../data/HotelRoom";
import { CreateHotelRoom, HotelRoom } from "../../interfaces/HotelRoom";
import { FormMode } from "../../helpers/FormUtils";

interface IHotelRoomFormValues {
  roomNumber: number;
  price: number;
  categoryRoom: string;
  imageUrl?: string;
  state?: string;
}

const hotelRoomFormValidationSchema = yup.object().shape({
  roomNumber: yup
    .number()
    .required(CHAMP_OBLIGATOIRE)
    .transform((val) => (val === Number(val) ? val : null)),
  price: yup
    .number()
    .required(CHAMP_OBLIGATOIRE)
    .transform((val) => (val === Number(val) ? val : null)),
  categoryRoom: yup.string().required(CHAMP_OBLIGATOIRE),
  imageUrl: yup.string().optional(),
  state: yup.string().optional(),
});

type HotelRoomFormProps = {
  submitFunction: (values: CreateHotelRoom) => void;
  formIsSubmitting: boolean;
  formMode: FormMode;
  hotelRoom?: HotelRoom;
};

const HotelRoomForm = ({
  submitFunction,
  formIsSubmitting,
  formMode,
  hotelRoom,
}: HotelRoomFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<IHotelRoomFormValues>({
    mode: "onChange",
    resolver: yupResolver(hotelRoomFormValidationSchema),
    defaultValues: {
      ...(hotelRoom && {
        roomNumber: hotelRoom.roomNumber,
        price: hotelRoom.price,
        categoryRoom: hotelRoom.category.toString(),
        state: hotelRoom.state,
        imageUrl: hotelRoom.imageUrl,
      }),
    },
  });

  const onSubmit = (values: IHotelRoomFormValues) => {
    const newHotelRoom: CreateHotelRoom = {
      id: values.roomNumber.toString(),
      roomNumber: values.roomNumber,
      price: values.price,
      category: values.categoryRoom as any,
      state: "",
      imageUrl: values.imageUrl ?? "",
    };

    submitFunction(newHotelRoom);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <CustomFormControl
          label={"Numéro de chambre"}
          errorField={errors.roomNumber}
          isRequired
        >
          <CustomInput
            type="number"
            name="roomNumber"
            register={register}
            min={0}
            disabled={formMode === FormMode.MODIFICATION}
          />
        </CustomFormControl>
        <CustomFormControl
          label={"Photo de la chambre"}
          errorField={errors.imageUrl}
        >
          <CustomInput
            type="text"
            name="imageUrl"
            register={register}
            placeholder="Saisir une url"
          />
        </CustomFormControl>
        <CustomFormControl
          label={"Prix (par nuit)"}
          errorField={errors.price}
          isRequired
        >
          <InputGroup>
            <CustomInput
              type="number"
              name="price"
              register={register}
              min={0}
            />
            <InputRightElement style={{ fontWeight: "600" }}>
              {DZD}
            </InputRightElement>
          </InputGroup>
        </CustomFormControl>
        <CustomFormControl
          label="Catégorie"
          errorField={errors.categoryRoom}
          isRequired
        >
          <Select
            {...register("categoryRoom")}
            placeholder={"Sélectionner une catégorie"}
            focusBorderColor="primary.300"
          >
            {CATEGORIES_ROOM.map((category) => (
              <option value={category} key={category}>
                {CATEGORY_ROOM_LABELS[category]}
              </option>
            ))}
          </Select>
        </CustomFormControl>
        {formMode === FormMode.MODIFICATION && (
          <CustomFormControl
            label={"État de la chambre"}
            errorField={errors.state}
          >
            <CustomInput type="text" name="state" register={register} />
          </CustomFormControl>
        )}
      </div>
      <Spacer height={"20px"} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="submit"
          colorScheme="primary"
          isDisabled={!isValid}
          isLoading={formIsSubmitting}
        >
          {formMode === FormMode.CREATION ? ENREGISTRER : METTRE_A_JOUR}
        </Button>
      </div>
    </form>
  );
};

export default HotelRoomForm;
