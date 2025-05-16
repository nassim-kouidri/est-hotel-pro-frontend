import { useEffect, useState, useCallback } from "react";
import { Reservation } from "../../interfaces/Reservation";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Spacer,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import { FaBed } from "react-icons/fa";
import { ReservationService } from "../../services/ReservationService";
import ReservationItem from "./ReservationItem";
import ReservationDetailedModal from "./ReservationDetailedModal";
import ReservationCalendar from "./ReservationCalendar";
import { useAuth } from "../../contexts/auth";
import { useToasts } from "../../contexts/toast";
import { HotelRoomService } from "../../services/HotelRoomService";
import { HotelRoom } from "../../interfaces/HotelRoom";
import ReservationFilters, {
  SelectedReservationFilters,
} from "./ReservationFilters";

const ReservationList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsAreLoading, setReservationsAreLoading] =
    useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  const [selectedReservationFilters, setSelectedReservationFilters] =
    useState<SelectedReservationFilters>({
      status: "",
      hotelRoomId: "",
    });

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [hotelRooms, setHotelRooms] = useState<HotelRoom[]>([]);
  const [availableRoomsCount, setAvailableRoomsCount] = useState<number>(0);
  const [availableRoomsLoading, setAvailableRoomsLoading] = useState<boolean>(false);

  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);

  const { user } = useAuth();
  const { pushToast } = useToasts();

  const fetchAvailableRooms = useCallback((date: string) => {
    if (user) {
      setAvailableRoomsLoading(true);
      HotelRoomService.getAvailableRoomsOnDate(user.token, date)
        .then((response) => {
          setAvailableRoomsCount(response.data.length);
        })
        .catch(() => {
          pushToast({
            content: "Erreur lors de la récupération des chambres disponibles",
            state: "ERROR",
          });
        })
        .finally(() => {
          setAvailableRoomsLoading(false);
        });
    }
  }, [user, pushToast]);

  const fetchHotelRooms = useCallback(() => {
    if (user) {
      HotelRoomService.getAllRooms(user.token).then((roomsRes) =>
        setHotelRooms(roomsRes.data)
      );
    }
  }, [user]);

  const fetchReservations = useCallback(() => {
    if (user && startDate && endDate) {
      setReservationsAreLoading(true);

      // If a day is selected, use it for both startDate and endDate
      const effectiveStartDate = selectedDay || startDate;
      const effectiveEndDate = selectedDay || endDate;

      ReservationService.getAllReservations(
        user.token,
        currentPage,
        9,
        selectedReservationFilters.status,
        selectedReservationFilters.hotelRoomId,
        effectiveStartDate,
        effectiveEndDate
      )
        .then((reservationsRes) => {
          const pageData = reservationsRes.data;
          setReservations(pageData.content);
          setTotalPages(pageData.totalPages);
          setTotalElements(pageData.totalElements);
        })
        .catch(() =>
          pushToast({
            content: "Erreur lors de la récupération des réservations",
            state: "ERROR",
          })
        )
        .finally(() => setReservationsAreLoading(false));
    }
  }, [user, startDate, endDate, selectedDay, currentPage, selectedReservationFilters, pushToast]);

  useEffect(() => {
    fetchHotelRooms();
  }, [fetchHotelRooms]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReservations();
    }
  }, [fetchReservations]);

  // Fetch available rooms for today when component mounts
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    fetchAvailableRooms(today);
  }, [fetchAvailableRooms]);

  const handleDateRangeChange = useCallback((newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, []);

  const handleDaySelect = useCallback((date: string | null) => {
    setSelectedDay(date);
    // Reset to first page when day selection changes
    setCurrentPage(0);

    // Fetch available rooms for selected day or today if deselected
    if (date) {
      fetchAvailableRooms(date);
    } else {
      const today = new Date().toISOString().split('T')[0];
      fetchAvailableRooms(today);
    }
  }, [fetchAvailableRooms]);

  const openDetailedModal = useCallback((reservation: Reservation) => {
    setSelectedReservationId(reservation.id);
    setIsDetailedModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsDetailedModalOpen(false);
    setSelectedReservationId(null);
    fetchReservations();
  }, [fetchReservations]);

  const applyFilters = useCallback((filters: SelectedReservationFilters) => {
    // Reset to first page when filters change
    setCurrentPage(0);
    setSelectedReservationFilters(filters);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    // Only change page if there are multiple pages
    if (totalPages > 1) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const statBg = useColorModeValue("primary.50", "primary.900");
  const selectedDayBg = useColorModeValue("primary.50", "primary.900");

  return (
    <>
      {selectedReservationId && (
        <ReservationDetailedModal
          reservationId={selectedReservationId}
          isOpen={isDetailedModalOpen}
          onClose={closeModal}
          hotelRooms={hotelRooms}
        />
      )}

      <Grid 
        templateColumns={{ base: "1fr", lg: "400px 1fr" }} 
        gap={6}
        maxW="1500px"
        mx="auto"
      >
        {/* Left Column - Calendar and Filters */}
        <GridItem>
          <Box 
            bg={bgColor} 
            borderRadius="lg" 
            boxShadow="sm"
            p={4}
            mb={6}
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Flex align="center" mb={4}>
              <Icon as={CalendarIcon} mr={2} color="primary.500" />
              <Heading size="md" fontWeight="medium">Calendrier</Heading>
            </Flex>

            <ReservationCalendar 
              onDateRangeChange={handleDateRangeChange}
              onDaySelect={handleDaySelect}
            />
          </Box>

          <Box 
            bg={bgColor} 
            borderRadius="lg" 
            boxShadow="sm"
            p={4}
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Flex align="center" mb={4}>
              <Icon as={InfoIcon} mr={2} color="primary.500" />
              <Heading size="md" fontWeight="medium">Filtres</Heading>
            </Flex>

            <ReservationFilters
              hotelRooms={hotelRooms}
              sendFilters={applyFilters}
            />

            {/* Available Rooms Stat */}
            <Box 
              mt={6} 
              p={4} 
              borderRadius="md" 
              bg={statBg}
              borderWidth="1px"
              borderColor="primary.100"
            >
              <Flex align="center">
                <Box 
                  p={2} 
                  borderRadius="full" 
                  bg="white" 
                  color="primary.500"
                  mr={3}
                  boxShadow="sm"
                >
                  <Icon as={FaBed} />
                </Box>
                <Stat>
                  <StatLabel fontSize="sm" fontWeight="medium">Chambres disponibles</StatLabel>
                  {availableRoomsLoading ? (
                    <Spinner size="sm" mt={1} />
                  ) : (
                    <>
                      <StatNumber fontSize="xl" fontWeight="bold" color="primary.500">
                        {availableRoomsCount}
                      </StatNumber>
                      <StatHelpText fontSize="xs">
                        {selectedDay 
                          ? 'le ' + new Date(selectedDay).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                          : 'aujourd\'hui'}
                      </StatHelpText>
                    </>
                  )}
                </Stat>
              </Flex>
            </Box>
          </Box>
        </GridItem>

        {/* Right Column - Reservations List */}
        <GridItem>
          <Box 
            bg={bgColor} 
            borderRadius="lg" 
            boxShadow="sm"
            p={4}
            borderWidth="1px"
            borderColor={borderColor}
          >
            {/* Selected Day Information */}
            {selectedDay && (
              <Box 
                mb={4} 
                p={3} 
                borderRadius="md" 
                bg={selectedDayBg} 
                borderWidth="1px" 
                borderColor="primary.200"
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center">
                    <CalendarIcon mr={2} />
                    <Text fontWeight="medium">
                      Réservations pour le {new Date(selectedDay).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                  </Flex>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    colorScheme="primary" 
                    onClick={() => handleDaySelect(null)}
                  >
                    Afficher tout le mois
                  </Button>
                </Flex>
              </Box>
            )}

            {/* Reservations List */}
            {reservationsAreLoading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color="primary.500" thickness="4px" />
              </Flex>
            ) : (
              <>
                {reservations.length === 0 ? (
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    h="200px" 
                    p={6}
                    borderRadius="md"
                    bg="gray.50"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderStyle="dashed"
                  >
                    <Text fontSize="lg" color="gray.500" mb={2}>Aucune réservation trouvée</Text>
                    <Text fontSize="sm" color="gray.400">Essayez de modifier vos filtres ou sélectionnez une autre date</Text>
                  </Flex>
                ) : (
                  <>
                    <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={6}>
                      {reservations.map((reservation) => (
                        <ReservationItem
                          key={reservation.id}
                          reservation={reservation}
                          openDetailedModal={openDetailedModal}
                        />
                      ))}
                    </SimpleGrid>

                    {/* Pagination */}
                    {totalPages > 0 && (
                      <Flex justifyContent="center" mt={8} flexDirection="column" alignItems="center">
                        <Text mb={2} color="gray.600">
                          {totalElements > 0 
                            ? `Affichage de ${currentPage * 9 + 1}-${Math.min((currentPage + 1) * 9, totalElements)} sur ${totalElements} réservations`
                            : `0 réservation trouvée`}
                        </Text>
                        <Box>
                          <Flex>
                            {totalPages > 1 && (
                              <>
                                <Button
                                  onClick={() => handlePageChange(0)}
                                  colorScheme="primary"
                                  variant={currentPage === 0 ? "solid" : "outline"}
                                  size="sm"
                                  mx={1}
                                >
                                  1
                                </Button>

                                {currentPage > 2 && (
                                  <Text alignSelf="center" mx={1}>
                                    ...
                                  </Text>
                                )}

                                {currentPage > 1 && (
                                  <Button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    colorScheme="primary"
                                    variant="outline"
                                    size="sm"
                                    mx={1}
                                  >
                                    {currentPage}
                                  </Button>
                                )}

                                {currentPage > 0 && currentPage < totalPages - 1 && (
                                  <Button
                                    onClick={() => handlePageChange(currentPage)}
                                    colorScheme="primary"
                                    variant="solid"
                                    size="sm"
                                    mx={1}
                                  >
                                    {currentPage + 1}
                                  </Button>
                                )}

                                {currentPage < totalPages - 2 && (
                                  <Button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    colorScheme="primary"
                                    variant="outline"
                                    size="sm"
                                    mx={1}
                                  >
                                    {currentPage + 2}
                                  </Button>
                                )}

                                {currentPage < totalPages - 3 && (
                                  <Text alignSelf="center" mx={1}>
                                    ...
                                  </Text>
                                )}

                                {currentPage !== totalPages - 1 && (
                                  <Button
                                    onClick={() => handlePageChange(totalPages - 1)}
                                    colorScheme="primary"
                                    variant={
                                      currentPage === totalPages - 1
                                        ? "solid"
                                        : "outline"
                                    }
                                    size="sm"
                                    mx={1}
                                  >
                                    {totalPages}
                                  </Button>
                                )}
                              </>
                            )}
                          </Flex>
                        </Box>
                      </Flex>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </GridItem>
      </Grid>
      <Spacer h={6} />
    </>
  );
};

export default ReservationList;
