import { Heading, Spacer } from "@chakra-ui/react";
import HotelRoomForm from "../../components/HotelRoom/HotelRoomForm";
import PageContainer from "../../layout/PageContainer";
import { CreateHotelRoom } from "../../interfaces/HotelRoom";
import { HotelRoomService } from "../../services/HotelRoomService";
import { useAuth } from "../../contexts/auth";
import { useToasts } from "../../contexts/toast";
import { useState } from "react";
import { FormMode } from "../../helpers/FormUtils";
import { useNavigate } from "react-router-dom";

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

  return (
    <PageContainer>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: "750px" }}>
          <Heading as="h3" size="lg">
            {"Nouvelle chambre"}
          </Heading>
          <Spacer h={6} />
          <HotelRoomForm
            submitFunction={addReservation}
            formIsSubmitting={formIsSubmitting}
            formMode={FormMode.CREATION}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default HotelRoomCreationView;
