import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Image,
  Box,
  Flex,
  Text,
  Badge,
  VStack,
  useColorModeValue,
  SimpleGrid, Heading,

} from "@chakra-ui/react";
import { CreateReservation, Reservation } from "../../interfaces/Reservation";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";
import { ReservationService } from "../../services/ReservationService";
import ReservationForm from "./ReservationForm";
import { FormMode } from "../../helpers/FormUtils";
import { DeleteIcon } from "@chakra-ui/icons";
import { useToasts } from "../../contexts/toast";
import { HotelRoom } from "../../interfaces/HotelRoom";
import { ADMIN_ROLE, DATE_FORMAT } from "../../data/constants";
import { CATEGORY_ROOM_LABELS } from "../../data/HotelRoom";
import { RESERVATION_STATUS_LABELS } from "../../data/Reservation";
import moment from "moment";
import accountSvg from "../../assets/account.svg";
import bedSvg from "../../assets/bed-king-outline.svg";
import childSvg from "../../assets/human-male-child.svg";
import calendarStartSvg from "../../assets/calendar-today-outline.svg";
import calendarEndSvg from "../../assets/calendar-outline.svg";

type ReservationDetailedModalProps = {
  reservationId: string;
  isOpen: boolean;
  onClose: () => void;
  hotelRooms: HotelRoom[];
};

const ReservationDetailedModal = ({
  reservationId,
  isOpen,
  onClose,
  hotelRooms,
}: ReservationDetailedModalProps) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [reservationIsLoading, setReservationIsLoading] =
    useState<boolean>(false);

  const { user } = useAuth();
  const { pushToast } = useToasts();

  useEffect(() => {
    fetchReservation();
  }, [reservationId]);

  const fetchReservation = () => {
    if (user) {
      setReservationIsLoading(true);
      ReservationService.getReservationById(user.token, reservationId)
        .then((reservationRes) => setReservation(reservationRes.data))
        .finally(() => setReservationIsLoading(false));
    }
  };

  const updateReservation = (updatedReservation: CreateReservation) => {
    if (user) {
      ReservationService.updateReservation(
        user.token,
        reservationId,
        updatedReservation
      )
        .then(() => {
          pushToast({
            content: "Réservation modifiée avec succès",
            state: "SUCCESS",
          });
          onClose();
        })
        .catch((err) => {
          pushToast({
            content: `Erreur lors de la modification de la réservation : ${err.response.data}`,
            state: "ERROR",
          });
        });
    }
  };

  const deleteReservation = () => {
    if (user && reservation) {
      ReservationService.deleteReservation(user.token, reservationId)
        .then(() => {
          pushToast({
            content: `Réservation de ${reservation.userSnapshot.firstName} ${reservation.userSnapshot.name} supprimée avec succès`,
            state: "SUCCESS",
          });
          onClose();
        })
        .catch(() => {
          pushToast({
            content: "Erreur lors de la suppression de la réservation",
            state: "ERROR",
          });
        });
    }
  };

  // Determine status color and label
  const getStatusInfo = (status: string | undefined) => {
    if (!status) return { color: "gray", label: "", bg: "gray.50" };

    switch(status) {
      case "COMING":
        return { 
          color: "teal", 
          label: RESERVATION_STATUS_LABELS["COMING"],
          bg: useColorModeValue("teal.50", "teal.900")
        };
      case "IN_PROGRESS":
        return { 
          color: "orange", 
          label: RESERVATION_STATUS_LABELS["IN_PROGRESS"],
          bg: useColorModeValue("orange.50", "orange.900")
        };
      default:
        return { 
          color: "gray", 
          label: RESERVATION_STATUS_LABELS["ENDED"],
          bg: useColorModeValue("gray.50", "gray.700")
        };
    }
  };

  // Color mode values for consistent theming
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="lg" overflow="hidden">
        {reservationIsLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="primary.500" thickness="4px" />
          </Flex>
        ) : (
          <>
            {reservation && (
              <>
                <ModalHeader 
                  bg={headerBg} 
                  py={4} 
                  borderBottom="1px" 
                  borderColor={borderColor}
                >
                  <Flex justify="space-between" align="center">
                    <Heading size="lg" fontWeight="bold">
                      {`Réservation de ${reservation.userSnapshot.firstName} ${reservation.userSnapshot.name}`}
                    </Heading>
                    {reservation.status && (
                      <Badge 
                        colorScheme={getStatusInfo(reservation.status.toString()).color}
                        fontSize="md"
                        px={3}
                        py={1}
                        borderRadius="md"
                        mr={10}
                      >
                        {getStatusInfo(reservation.status.toString()).label}
                      </Badge>
                    )}
                  </Flex>
                </ModalHeader>
                <ModalCloseButton size="lg" />

                <ModalBody p={6}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                    {/* Left column - Image and summary */}
                    <Box>
                      <Box 
                        position="relative" 
                        borderRadius="md" 
                        overflow="hidden"
                        boxShadow="md"
                        mb={4}
                      >
                        <Image
                          src={reservation.hotelRoom.imageUrl}
                          borderRadius="md"
                          width="100%"
                          height="250px"
                          objectFit="cover"
                        />

                        {/* Room info overlay on the image */}
                        <Box 
                          position="absolute" 
                          bottom="0" 
                          left="0" 
                          right="0" 
                          bg="rgba(0,0,0,0.7)" 
                          color="white"
                          p={3}
                        >
                          <Flex align="center">
                            <Box as="img" src={bedSvg} width="20px" height="20px" mr={2} filter="invert(1)" />
                            <Text fontWeight="bold" fontSize="lg">
                              {`${CATEGORY_ROOM_LABELS[reservation.hotelRoom.category]} - Chambre n°${reservation.hotelRoom.roomNumber}`}
                            </Text>
                          </Flex>
                        </Box>
                      </Box>

                      {/* Reservation Summary */}
                      <Box 
                        bg={sectionBg} 
                        p={4} 
                        borderRadius="md" 
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <Text fontWeight="bold" fontSize="lg" mb={3}>Résumé de la réservation</Text>

                        <SimpleGrid columns={2} spacing={4}>
                          <VStack align="start" spacing={1}>
                            <Flex align="center">
                              <Box as="img" src={calendarStartSvg} width="16px" height="16px" mr={2} />
                              <Text fontSize="sm" color={mutedColor}>Date d'arrivée</Text>
                            </Flex>
                            <Text fontWeight="medium">{moment(reservation.startDate).format(DATE_FORMAT)}</Text>
                          </VStack>

                          <VStack align="start" spacing={1}>
                            <Flex align="center">
                              <Box as="img" src={calendarEndSvg} width="16px" height="16px" mr={2} />
                              <Text fontSize="sm" color={mutedColor}>Date de départ</Text>
                            </Flex>
                            <Text fontWeight="medium">{moment(reservation.endDate).format(DATE_FORMAT)}</Text>
                          </VStack>

                          <VStack align="start" spacing={1}>
                            <Flex align="center">
                              <Box as="img" src={accountSvg} width="16px" height="16px" mr={2} />
                              <Text fontSize="sm" color={mutedColor}>Adultes</Text>
                            </Flex>
                            <Text fontWeight="medium">{reservation.numberOfAdults}</Text>
                          </VStack>

                          <VStack align="start" spacing={1}>
                            <Flex align="center">
                              <Box as="img" src={childSvg} width="16px" height="16px" mr={2} />
                              <Text fontSize="sm" color={mutedColor}>Enfants</Text>
                            </Flex>
                            <Text fontWeight="medium">{reservation.numberOfChildren}</Text>
                          </VStack>

                          <VStack align="start" spacing={1} gridColumn="span 2">
                            <Text fontSize="sm" color={mutedColor}>Prix total</Text>
                            <Text fontWeight="bold" fontSize="xl" color="primary.500">
                              {`${reservation.pricePaid} DZD`}
                            </Text>
                          </VStack>
                        </SimpleGrid>
                      </Box>
                    </Box>

                    {/* Right column - Form */}
                    <Box 
                      bg={sectionBg} 
                      p={4} 
                      borderRadius="md" 
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Text fontWeight="bold" fontSize="lg" mb={3}>Modifier la réservation</Text>

                      <ReservationForm
                        submitFunction={updateReservation}
                        formIsSubmitting={false}
                        formMode={FormMode.MODIFICATION}
                        allRooms={hotelRooms}
                        reservation={reservation}
                      />
                    </Box>
                  </SimpleGrid>

                  {user?.accountResponse.role === ADMIN_ROLE && (
                    <Flex justify="flex-end" mt={4}>
                      <Button
                        leftIcon={<DeleteIcon />}
                        size="md"
                        colorScheme="red"
                        onClick={deleteReservation}
                        variant="outline"
                        _hover={{ bg: "red.50" }}
                        boxShadow="sm"
                      >
                        Supprimer la réservation
                      </Button>
                    </Flex>
                  )}
                </ModalBody>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ReservationDetailedModal;
