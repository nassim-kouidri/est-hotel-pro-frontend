import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import CustomFormControl from "../Form/CustomFormControl";
import CustomInput from "../Form/CustomInput";
import {
  Box,
  Button,
  Flex,
  Heading,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Icon,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaUser, FaBed, FaCalendarAlt, FaUsers, FaStar, FaInfoCircle } from "react-icons/fa";
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
import { HotelRoomService } from "../../services/HotelRoomService";
import { useAuth } from "../../contexts/auth";

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
  const [availableRooms, setAvailableRooms] = useState<HotelRoom[]>([]);
  const [isLoadingAvailableRooms, setIsLoadingAvailableRooms] = useState<boolean>(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState<boolean>(false);

  const { user } = useAuth();

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

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Fetch available rooms when dates change
  useEffect(() => {
    // Only check availability if both dates are selected and start date is before or equal to end date
    if (startDate && endDate && startDate <= endDate && user && formMode === FormMode.CREATION) {
      setIsLoadingAvailableRooms(true);
      HotelRoomService.getAvailableRoomsBetweenDates(user.token, startDate, endDate)
        .then((response) => {
          setAvailableRooms(response.data);
          setHasCheckedAvailability(true);
        })
        .catch((error) => {
          console.error("Error fetching available rooms:", error);
          setAvailableRooms([]);
        })
        .finally(() => {
          setIsLoadingAvailableRooms(false);
        });
    }
  }, [startDate, endDate, user, formMode]);

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

  const selectedRoomId = watch("roomId");
  const selectedRoom = selectedRoomId ? allRooms.find(room => room.id === selectedRoomId) : undefined;
  const selectedRoomPrice = selectedRoom?.price;

  // Color mode values for consistent theming
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const iconColor = useColorModeValue("primary.500", "primary.300");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        {/* User Information Section */}
        <Card 
          mb={6} 
          variant="outline" 
          borderColor={borderColor} 
          boxShadow="sm"
          borderRadius="md"
          overflow="hidden"
        >
          <CardHeader 
            bg={sectionBg} 
            py={3} 
            px={4} 
            borderBottomWidth="1px" 
            borderColor={borderColor}
          >
            <Flex align="center">
              <Icon as={FaUser} mr={2} color={iconColor} />
              <Heading as="h3" size="md" fontWeight="medium">
                {"Informations du client"}
              </Heading>
            </Flex>
          </CardHeader>
          <CardBody p={4}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
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
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Reservation Details Section */}
        <Card 
          mb={6} 
          variant="outline" 
          borderColor={borderColor} 
          boxShadow="sm"
          borderRadius="md"
          overflow="hidden"
        >
          <CardHeader 
            bg={sectionBg} 
            py={3} 
            px={4} 
            borderBottomWidth="1px" 
            borderColor={borderColor}
          >
            <Flex align="center">
              <Icon as={FaBed} mr={2} color={iconColor} />
              <Heading as="h3" size="md" fontWeight="medium">
                {"Détails de la réservation"}
              </Heading>
            </Flex>
          </CardHeader>
          <CardBody p={4}>
            {/* Room and Price */}
            <Box mb={5}>
              <Flex align="center" mb={3}>
                <Icon as={FaBed} mr={2} color={iconColor} size="sm" />
                <Text fontWeight="medium">Chambre et tarif</Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <CustomFormControl
                  label={"Chambre"}
                  errorField={errors.roomId}
                  isRequired
                >
                  {formMode === FormMode.CREATION && startDate && endDate ? (
                    <>
                      {isLoadingAvailableRooms ? (
                        <Flex align="center" justify="center" py={2}>
                          <Spinner size="sm" mr={2} color="primary.500" />
                          <Text>Vérification des disponibilités...</Text>
                        </Flex>
                      ) : hasCheckedAvailability ? (
                        <>
                          {availableRooms.length > 0 ? (
                            <>
                              <Flex align="center" mb={2}>
                                <Badge colorScheme="green" mr={2}>
                                  {availableRooms.length} chambre{availableRooms.length > 1 ? 's' : ''} disponible{availableRooms.length > 1 ? 's' : ''}
                                </Badge>
                                <Text fontSize="sm" color="gray.600">
                                  pour la période sélectionnée
                                </Text>
                              </Flex>
                              <Select
                                {...register("roomId")}
                                placeholder={"Sélectionner une chambre disponible"}
                                focusBorderColor="primary.300"
                                size="md"
                                bg="white"
                              >
                                {availableRooms.map((room) => (
                                  <option value={room.id} key={room.id}>
                                    {`n°${room.roomNumber} (${
                                      CATEGORY_ROOM_LABELS[room.category]
                                    })`}
                                  </option>
                                ))}
                              </Select>
                            </>
                          ) : (
                            <>
                              <Alert status="warning" mb={2} borderRadius="md">
                                <AlertIcon />
                                <Text>Aucune chambre disponible pour cette période</Text>
                              </Alert>
                              <Select
                                {...register("roomId")}
                                placeholder={"Aucune chambre disponible"}
                                isDisabled
                                focusBorderColor="primary.300"
                                size="md"
                                bg="white"
                              />
                            </>
                          )}
                        </>
                      ) : (
                        <Select
                          {...register("roomId")}
                          placeholder={"Sélectionnez les dates pour voir les disponibilités"}
                          isDisabled
                          focusBorderColor="primary.300"
                          size="md"
                          bg="white"
                        />
                      )}
                    </>
                  ) : (
                    // Original select for modification mode or when dates are not selected
                    <Select
                      {...register("roomId")}
                      placeholder={"Numéro de chambre"}
                      focusBorderColor="primary.300"
                      size="md"
                      bg="white"
                    >
                      {allRooms.map((room) => (
                        <option value={room.id} key={room.id}>
                          {`n°${room.roomNumber} (${
                            CATEGORY_ROOM_LABELS[room.category]
                          })`}
                        </option>
                      ))}
                    </Select>
                  )}
                </CustomFormControl>
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
                      placeholder={selectedRoomPrice ? selectedRoomPrice.toString() + " " + DZD : ""}
                    />
                    <InputRightElement style={{ fontWeight: "600" }}>
                      {DZD}
                    </InputRightElement>
                  </InputGroup>
                </CustomFormControl>
              </SimpleGrid>
            </Box>

            {/* Dates */}
            <Box mb={5}>
              <Flex align="center" mb={3}>
                <Icon as={FaCalendarAlt} mr={2} color={iconColor} size="sm" />
                <Text fontWeight="medium">Dates du séjour</Text>
              </Flex>

              {formMode === FormMode.CREATION && (
                <Flex align="center" mb={3} bg="blue.50" p={2} borderRadius="md" borderWidth="1px" borderColor="blue.200">
                  <Icon as={FaInfoCircle} mr={2} color="blue.500" />
                  <Text fontSize="sm" color="blue.700">
                    Sélectionnez les dates de séjour pour voir les chambres disponibles sur cette période
                  </Text>
                </Flex>
              )}

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
              </SimpleGrid>
            </Box>

            {/* Guests */}
            <Box>
              <Flex align="center" mb={3}>
                <Icon as={FaUsers} mr={2} color={iconColor} size="sm" />
                <Text fontWeight="medium">Nombre de personnes</Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
              </SimpleGrid>
            </Box>
          </CardBody>
        </Card>

        {/* Review Section - Only shown if end date is in the past */}
        {isEndDateInPast && (
          <Card 
            mb={6} 
            variant="outline" 
            borderColor={borderColor} 
            boxShadow="sm"
            borderRadius="md"
            overflow="hidden"
          >
            <CardHeader 
              bg={sectionBg} 
              py={3} 
              px={4} 
              borderBottomWidth="1px" 
              borderColor={borderColor}
            >
              <Flex align="center">
                <Icon as={FaStar} mr={2} color={iconColor} />
                <Heading as="h3" size="md" fontWeight="medium">
                  {"Avis et commentaires"}
                </Heading>
              </Flex>
            </CardHeader>
            <CardBody p={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        {/* Submit Button */}
        <Box 
          mt={8} 
          p={4} 
          borderRadius="md" 
          bg={sectionBg}
          borderWidth="1px"
          borderColor={borderColor}
          textAlign="center"
        >
          <Button
            type="submit"
            colorScheme="primary"
            isDisabled={!isValid}
            isLoading={formIsSubmitting}
            size="lg"
            px={10}
            py={6}
            boxShadow="md"
            _hover={{ 
              boxShadow: "lg",
              transform: "translateY(-2px)"
            }}
            transition="all 0.2s"
          >
            {formMode === FormMode.CREATION ? ENREGISTRER : METTRE_A_JOUR}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default ReservationForm;
