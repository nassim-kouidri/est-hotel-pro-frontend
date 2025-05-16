import { Box, Heading, Flex, Divider, Image, useColorModeValue } from "@chakra-ui/react";
import ReservationForm from "../../components/Reservation/ReservationForm";
import PageContainer from "../../layout/PageContainer";
import { CreateReservation } from "../../interfaces/Reservation";
import { ReservationService } from "../../services/ReservationService";
import { useEffect, useState } from "react";
import { useToasts } from "../../contexts/toast";
import { useAuth } from "../../contexts/auth";
import { FormMode } from "../../helpers/FormUtils";
import { useNavigate } from "react-router-dom";
import { HotelRoomService } from "../../services/HotelRoomService";
import { HotelRoom } from "../../interfaces/HotelRoom";
import logoImage from "../../assets/logo-est-hotel-pro.png";

const ReservationCreationView = () => {
  const [formIsSubmitting, setFormIsSubmitting] = useState<boolean>(false);

  const [hotelRooms, setHotelRooms] = useState<HotelRoom[]>([]);

  const { pushToast } = useToasts();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotelRooms();
  }, []);

  const fetchHotelRooms = () => {
    if (user) {
      HotelRoomService.getAllRooms(user.token).then((roomsRes) =>
        setHotelRooms(roomsRes.data)
      );
    }
  };

  const createReservation = (newReservation: CreateReservation) => {
    if (user) {
      setFormIsSubmitting(true);
      ReservationService.createReservation(user.token, newReservation)
        .then(() => {
          pushToast({
            state: "SUCCESS",
            content: "Nouvelle réservation créée avec succès",
          });
          navigate("/reservation");
        })
        .catch((err) => {
          console.log(err);
          pushToast({
            state: "ERROR",
            content: `Erreur lors de la création de la réservation : ${err.response.data}`,
          });
        })
        .finally(() => setFormIsSubmitting(false));
    }
  };

  // Color mode values for consistent theming
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <PageContainer>
      <Box 
        maxWidth={"900px"} 
        mx="auto" 
        p={6} 
        borderRadius="lg" 
        boxShadow="md" 
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Flex direction="column" align="center" mb={6}>
          <Image
            src={logoImage}
            alt="Est Hotel Pro Logo"
            maxWidth="180px"
            mb={4}
          />
          <Heading as="h2" size="lg" textAlign={"center"} fontWeight="medium" color="gray.700">
            {"Nouvelle réservation"}
          </Heading>
        </Flex>

        <Divider my={5} />

        <ReservationForm
          submitFunction={createReservation}
          formIsSubmitting={formIsSubmitting}
          formMode={FormMode.CREATION}
          allRooms={hotelRooms}
        />
      </Box>
    </PageContainer>
  );
};

export default ReservationCreationView;
