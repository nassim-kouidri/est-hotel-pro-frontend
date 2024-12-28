import { useEffect, useState } from "react";
import {
  Container,
  Divider,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
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
      <Container>
        <HotelRoomFilters sendFilters={applyFilters} />
      </Container>

      <Spacer h={6} />
      <Divider />
      <Spacer h={6} />

      <Container maxW={"container.xl"}>
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
      </Container>
    </>
  );
};

export default HotelRoomList;
