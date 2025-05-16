import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { HotelRoom } from "../../interfaces/HotelRoom";
import { HotelRoomService } from "../../services/HotelRoomService";
import HotelRoomItem from "./HotelRoomItem";
import HotelRoomDetailedModal from "./HotelRoomDetailedModal";
import { useAuth } from "../../contexts/auth";
import { useToasts } from "../../contexts/toast";
import HotelRoomFilters, { SelectedHotelRoomFilters } from "./HotelRoomFilters";
import { AVAILABLE, RESERVED } from "../../data/HotelRoom";

const HotelRoomList = () => {
  const [hotelRooms, setHotelRooms] = useState<HotelRoom[]>([]);
  const [hotelRoomsAreLoading, setHotelRoomsAreLoading] =
    useState<boolean>(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const [selectedHotelRoomFilters, setSelectedHotelRoomFilters] =
    useState<SelectedHotelRoomFilters>({
      categoryRoom: "",
      roomStatus: "",
    });

  const [selectedHotelRoomId, setSelectedHotelRoomId] = useState<string | null>(
    null
  );

  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);

  const { user } = useAuth();
  const { pushToast } = useToasts();

  useEffect(() => {
    fetchHotelRooms();
  }, [
    selectedHotelRoomFilters.categoryRoom,
    selectedHotelRoomFilters.roomStatus,
  ]);

  const fetchHotelRooms = () => {
    const isAvailable =
      selectedHotelRoomFilters.roomStatus == AVAILABLE
        ? true
        : selectedHotelRoomFilters.roomStatus == RESERVED
        ? false
        : undefined;

    if (user) {
      setHotelRoomsAreLoading(true);
      HotelRoomService.getFilteredRooms(
        user.token,
        selectedHotelRoomFilters.categoryRoom,
        isAvailable
      )
        .then((hotelRoomsRes) => setHotelRooms(hotelRoomsRes.data))
        .catch(() =>
          pushToast({
            content: "Erreur lors de la récupération des chambres",
            state: "ERROR",
          })
        )
        .finally(() => setHotelRoomsAreLoading(false));
    }
  };

  const openDetailedModal = (hotelRoom: HotelRoom) => {
    setSelectedHotelRoomId(hotelRoom.id);
    setIsDetailedModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailedModalOpen(false);
    setSelectedHotelRoomId(null);
    fetchHotelRooms();
  };

  const applyFilters = (filters: SelectedHotelRoomFilters) => {
    setSelectedHotelRoomFilters(filters);
  };

  return (
    <>
      {selectedHotelRoomId && isDetailedModalOpen && (
        <HotelRoomDetailedModal
          hotelRoomId={selectedHotelRoomId}
          isOpen={isDetailedModalOpen}
          onClose={closeModal}
        />
      )}
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
          <Icon as={InfoIcon} mr={2} color="primary.500" />
          <Heading size="md" fontWeight="medium">Filtres</Heading>
        </Flex>

        <HotelRoomFilters sendFilters={applyFilters} />
      </Box>

      <Spacer h={2} />
      <Divider />
      <Spacer h={6} />

      {hotelRoomsAreLoading ? (
        <Spinner />
      ) : (
        <>
          {hotelRooms.length === 0 ? (
            <Text>{"Aucune chambre trouvée"}</Text>
          ) : (
            <SimpleGrid columns={3} spacing={6}>
              {hotelRooms.map((hotelRoom) => (
                <HotelRoomItem
                  key={hotelRoom.id}
                  hotelRoom={hotelRoom}
                  openDetailedModal={openDetailedModal}
                />
              ))}
            </SimpleGrid>
          )}
        </>
      )}
    </>
  );
};

export default HotelRoomList;
