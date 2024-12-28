import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { CreateHotelRoom, HotelRoom } from "../../interfaces/HotelRoom";
import { HotelRoomService } from "../../services/HotelRoomService";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import HotelRoomForm from "./HotelRoomForm";
import { FormMode } from "../../helpers/FormUtils";
import { useToasts } from "../../contexts/toast";
import { DeleteIcon } from "@chakra-ui/icons";
import { ADMIN_ROLE } from "../../data/constants";

type HotelRoomDetailedModalProps = {
  hotelRoomId: string;
  isOpen: boolean;
  onClose: () => void;
};

const HotelRoomDetailedModal = ({
  hotelRoomId,
  isOpen,
  onClose,
}: HotelRoomDetailedModalProps) => {
  const [hotelRoom, setHotelRoom] = useState<HotelRoom | null>(null);
  const [hotelRoomIsLoading, setHotelRoomIsLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const { pushToast } = useToasts();

  useEffect(() => {
    fetchHotelRoom();
  }, [hotelRoomId]);

  const fetchHotelRoom = () => {
    if (user) {
      setHotelRoomIsLoading(true);
      HotelRoomService.getRoomById(user.token, hotelRoomId)
        .then((hotelRoomRes) => setHotelRoom(hotelRoomRes.data))
        .finally(() => setHotelRoomIsLoading(false));
    }
  };

  const updateRoom = (updatedRoom: CreateHotelRoom) => {
    if (user) {
      HotelRoomService.updateRoom(user.token, hotelRoomId, updatedRoom)
        .then(() => {
          pushToast({
            content: "Chambre modifiée avec succès",
            state: "SUCCESS",
          });
          onClose();
        })
        .catch((err) => {
          pushToast({
            content: `Erreur lors de la modification de la chambre : ${err.response.data}`,
            state: "ERROR",
          });
        });
    }
  };

  const deleteRoom = () => {
    if (user) {
      HotelRoomService.deleteRoom(user.token, hotelRoomId)
        .then(() => {
          pushToast({
            content: `Chambre n°${hotelRoomId} supprimée avec succès`,
            state: "SUCCESS",
          });
          onClose();
        })
        .catch(() => {
          pushToast({
            content: "Erreur lors de la suppression de la chambre",
            state: "ERROR",
          });
        });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {hotelRoomIsLoading ? (
          <Spinner />
        ) : (
          <>
            {hotelRoom && (
              <>
                <ModalHeader>{`Chambre n°${hotelRoom.roomNumber}`}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Image src={hotelRoom.imageUrl} borderRadius="sm" />

                  <Spacer h={6} />

                  <HotelRoomForm
                    submitFunction={updateRoom}
                    formIsSubmitting={false}
                    formMode={FormMode.MODIFICATION}
                    hotelRoom={hotelRoom}
                  />

                  {user?.accountResponse.role === ADMIN_ROLE && (
                    <>
                      {" "}
                      <Spacer h={6} />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Button
                          leftIcon={<DeleteIcon />}
                          size={"sm"}
                          colorScheme={"red"}
                          onClick={deleteRoom}
                          variant={"outline"}
                        >
                          {"Supprimer"}
                        </Button>
                      </div>
                    </>
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

export default HotelRoomDetailedModal;
