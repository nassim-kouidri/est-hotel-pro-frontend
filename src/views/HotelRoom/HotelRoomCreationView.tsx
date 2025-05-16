import { Box, Heading, Flex, Divider, Image, useColorModeValue } from "@chakra-ui/react";
import HotelRoomForm from "../../components/HotelRoom/HotelRoomForm";
import PageContainer from "../../layout/PageContainer";
import { CreateHotelRoom } from "../../interfaces/HotelRoom";
import { HotelRoomService } from "../../services/HotelRoomService";
import { useAuth } from "../../contexts/auth";
import { useToasts } from "../../contexts/toast";
import { useState } from "react";
import { FormMode } from "../../helpers/FormUtils";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo-est-hotel-pro.png";

const HotelRoomCreationView = () => {
  const [formIsSubmitting, setFormIsSubmitting] = useState<boolean>(false);

  const { pushToast } = useToasts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const addReservation = (newHotelRoom: CreateHotelRoom) => {
    if (user) {
      setFormIsSubmitting(true);
      HotelRoomService.createRoom(user.token, newHotelRoom)
        .then(() => {
          pushToast({
            content: "Nouvelle chambre créée avec succès",
            state: "SUCCESS",
          });
          navigate("/hotelRoom");
        })
        .catch((err) =>
          pushToast({
            content: `Erreur lors de la création de la chambre : ${err.response.data}`,
            state: "ERROR",
          })
        )
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
            {"Nouvelle chambre"}
          </Heading>
        </Flex>

        <Divider my={5} />

        <HotelRoomForm
          submitFunction={addReservation}
          formIsSubmitting={formIsSubmitting}
          formMode={FormMode.CREATION}
        />
      </Box>
    </PageContainer>
  );
};

export default HotelRoomCreationView;
