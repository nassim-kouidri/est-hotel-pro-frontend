import { Button, Heading, Spacer } from "@chakra-ui/react";
import PageContainer from "../../layout/PageContainer";
import { useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import ReservationList from "../../components/Reservation/ReservationList";

const ReservationView = () => {
  const navigate = useNavigate();

  const navigateToCreationReservation = () => {
    navigate("creation");
  };

  return (
    <PageContainer>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Heading>{"Réservations"}</Heading>
        <Button
          leftIcon={<AddIcon />}
          onClick={navigateToCreationReservation}
          alignSelf={"flex-end"}
          colorScheme="primary"
        >
          {"Créer une réservation"}
        </Button>
      </div>
      <Spacer height={"4rem"} />
      <ReservationList />
    </PageContainer>
  );
};

export default ReservationView;
