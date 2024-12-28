import { Button, Heading, Spacer } from "@chakra-ui/react";
import PageContainer from "../../layout/PageContainer";
import { useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import HotelRoomList from "../../components/HotelRoom/HotelRoomList";

const HotelRoomView = () => {
  const navigate = useNavigate();

  const navigateToCreationReservation = () => {
    navigate("creation");
  };

  return (
    <PageContainer>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Heading>{"Chambres"}</Heading>
        <Button
          leftIcon={<AddIcon />}
          onClick={navigateToCreationReservation}
          alignSelf={"flex-end"}
          colorScheme="primary"
        >
          {"Ajouter une chambre"}
        </Button>
      </div>
      <Spacer height={"4rem"} />
      <HotelRoomList />
    </PageContainer>
  );
};

export default HotelRoomView;
