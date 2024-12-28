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
import CustomTextArea from "../Form/CustomTextArea";
import {
  CreateReservation,
  Reservation,
  UserSnapshot,
} from "../../interfaces/Reservation";
import { FormMode } from "../../helpers/FormUtils";
import { HotelRoom } from "../../interfaces/HotelRoom";
import { CATEGORY_ROOM_LABELS } from "../../data/HotelRoom";

interface IReservationFormValues {
  userName: string;
  userFirstName: string;
  userNumberPhone: string;
  roomId: string;
  startDate: string;
  endDate: string;
  claim?: string;
  numberOfChildren: number;
  numberOfAdults: number;
  pricePaid: number;
  review?: number | null;
}

const reservationFormValidationSchema = yup.object().shape({
  userName: yup.string().required(CHAMP_OBLIGATOIRE),
  userFirstName: yup.string().required(CHAMP_OBLIGATOIRE),
  userNumberPhone: yup.string().required(CHAMP_OBLIGATOIRE),
  roomId: yup.string().required(CHAMP_OBLIGATOIRE),
  startDate: yup.string().required(CHAMP_OBLIGATOIRE),
  endDate: yup.string().required(CHAMP_OBLIGATOIRE),
  claim: yup.string().optional(),
  numberOfChildren: yup
    .number()
    .required(CHAMP_OBLIGATOIRE)
    .min(0)
    .transform((val) => (val === Number(val) ? val : null)),
  numberOfAdults: yup
    .number()
    .required(CHAMP_OBLIGATOIRE)
    .min(0)
    .transform((val) => (val === Number(val) ? val : null)),
  pricePaid: yup
    .number()
    .required(CHAMP_OBLIGATOIRE)
    .min(0)
    .transform((val) => (val === Number(val) ? val : null)),
  review: yup
    .number()
    .nullable()
    .min(0, "Ce champ ne peut pas être négatif")
    .max(5, "La note doit être comprise entre 0 et 5")
    .transform((val) => (val === Number(val) ? val : null)),
});

type ReservationFormProps = {
  submitFunction: (newReservation: CreateReservation) => void;
  formIsSubmitting: boolean;
  formMode: FormMode;
  allRooms: HotelRoom[];
  reservation?: Reservation;
};

const ReservationForm = ({
  submitFunction,
  formIsSubmitting,
  formMode,
  allRooms,
  reservation,
}: ReservationFormProps) => {
  const {
    watch,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<IReservationFormValues>({
    mode: "onChange",
    resolver: yupResolver(reservationFormValidationSchema),
    defaultValues: {
      ...(reservation && {
        userName: reservation.userSnapshot.name,
        userFirstName: reservation.userSnapshot.firstName,
        userNumberPhone: reservation.userSnapshot.numberPhone,
        roomId: reservation.hotelRoom.id,
        startDate: reservation.startDate.split("T")[0],
        endDate: reservation.endDate.split("T")[0],
        claim: reservation.claim,
        numberOfAdults: reservation.numberOfAdults,
        numberOfChildren: reservation.numberOfChildren,
        pricePaid: reservation.pricePaid,
        review: reservation.review,
      }),
    },
  });

  const onSubmit = (values: IReservationFormValues) => {
    const reservationUser: UserSnapshot = {
      name: values.userName,
      firstName: values.userFirstName,
      numberPhone: values.userNumberPhone,
    };
    const startDate = new Date(values.startDate);
    const endDate = new Date(values.endDate);

    const newReservation: CreateReservation = {
      roomId: values.roomId,
      userSnapshot: reservationUser,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      claim: values.claim,
      numberOfChildren: values.numberOfChildren,
      numberOfAdults: values.numberOfAdults,
      pricePaid: values.pricePaid,
      ...(values.review && { review: values.review }),
    };

    submitFunction(newReservation);
  };

  const toDay = new Date().toISOString().split("T")[0];

  const isEndDateInPast = watch("endDate") < toDay;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div style={{ display: "flex", gap: "15px" }}>
          <CustomFormControl
            label={"Nom"}
            errorField={errors.userName}
            isRequired
          >
            <CustomInput type="text" name="userName" register={register} />
          </CustomFormControl>
          <CustomFormControl
            label={"Prénom"}
            errorField={errors.userFirstName}
            isRequired
          >
            <CustomInput type="text" name="userFirstName" register={register} />
          </CustomFormControl>
          <CustomFormControl
            label={"Téléphone"}
            errorField={errors.userNumberPhone}
            isRequired
          >
            <CustomInput
              type="text"
              name="userNumberPhone"
              register={register}
            />
          </CustomFormControl>
        </div>
        <CustomFormControl
          label={"Chambre"}
          errorField={errors.roomId}
          isRequired
        >
          <Select
            {...register("roomId")}
            placeholder={"Numéro de chambre"}
            focusBorderColor="primary.300"
          >
            {allRooms.map((room) => (
              <option value={room.id} key={room.id}>
                {`n°${room.roomNumber} (${
                  CATEGORY_ROOM_LABELS[room.category]
                })`}
              </option>
            ))}
          </Select>
        </CustomFormControl>
        <div style={{ display: "flex", gap: "15px" }}>
          <CustomFormControl
            label={"Début"}
            errorField={errors.startDate}
            isRequired
          >
            <CustomInput
              type="date"
              name="startDate"
              register={register}
              disabled={formMode === FormMode.MODIFICATION}
            />
          </CustomFormControl>
          <CustomFormControl
            label={"Fin"}
            errorField={errors.endDate}
            isRequired
          >
            <CustomInput
              type="date"
              name="endDate"
              register={register}
              disabled={formMode === FormMode.MODIFICATION}
            />
          </CustomFormControl>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <CustomFormControl
            label={"Nombre d'enfants"}
            errorField={errors.numberOfChildren}
            isRequired
          >
            <CustomInput
              type="number"
              name="numberOfChildren"
              register={register}
              min={0}
            />
          </CustomFormControl>
          <CustomFormControl
            label={"Nombre d'adultes"}
            errorField={errors.numberOfAdults}
            isRequired
          >
            <CustomInput
              type="number"
              name="numberOfAdults"
              register={register}
              min={0}
            />
          </CustomFormControl>
        </div>
        <CustomFormControl
          label={"Prix total"}
          errorField={errors.pricePaid}
          isRequired
        >
          <InputGroup>
            <CustomInput
              type="number"
              name="pricePaid"
              register={register}
              min={0}
            />
            <InputRightElement style={{ fontWeight: "600" }}>
              {DZD}
            </InputRightElement>
          </InputGroup>
        </CustomFormControl>
        {isEndDateInPast && (
          <>
            <CustomFormControl
              label={"Avis (note sur 5)"}
              errorField={errors.review}
            >
              <CustomInput
                type="number"
                name="review"
                register={register}
                min={0}
                max={5}
              />
            </CustomFormControl>
            <CustomFormControl label="Commentaire" errorField={errors.claim}>
              <CustomTextArea name="claim" register={register} />
            </CustomFormControl>
          </>
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

export default ReservationForm;
