import { Button, Heading, Flex, Box, useColorModeValue } from "@chakra-ui/react";
import PageContainer from "../../layout/PageContainer";
import { useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import ReservationList from "../../components/Reservation/ReservationList";

const ReservationView = () => {
  const navigate = useNavigate();

  const navigateToCreationReservation = () => {
    navigate("creation");
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <PageContainer>
      <Box 
        bg={bgColor} 
        borderRadius="lg" 
        boxShadow="sm"
        p={5}
        mb={6}
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg" fontWeight="bold" color="gray.700">
            {"Réservations"}
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            onClick={navigateToCreationReservation}
            colorScheme="primary"
            size="md"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
          >
            {"Créer une réservation"}
          </Button>
        </Flex>
      </Box>
      <ReservationList />
    </PageContainer>
  );
};

export default ReservationView;
