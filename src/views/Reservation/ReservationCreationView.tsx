import { Heading, Spacer } from "@chakra-ui/react";
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
            {"Nouvelle réservation"}
          </Heading>

          <Spacer h={6} />

          <ReservationForm
            submitFunction={createReservation}
            formIsSubmitting={formIsSubmitting}
            formMode={FormMode.CREATION}
            allRooms={hotelRooms}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default ReservationCreationView;
