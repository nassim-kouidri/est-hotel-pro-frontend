import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Spacer,
  Tag,
  Image,
} from "@chakra-ui/react";
import { Reservation } from "../../interfaces/Reservation";
import moment from "moment";
import { DATE_FORMAT } from "../../data/constants";
import { CATEGORY_ROOM_LABELS } from "../../data/HotelRoom";
import { RESERVATION_STATUS_LABELS } from "../../data/Reservation";
import accountSvg from "../../assets/account.svg";
import bedSvg from "../../assets/bed-king-outline.svg";
import childSvg from "../../assets/human-male-child.svg";
import calendarStartSvg from "../../assets/calendar-today-outline.svg";
import calendarEndSvg from "../../assets/calendar-outline.svg";

type ReservationItemProps = {
  reservation: Reservation;
  openDetailedModal: (reservation: Reservation) => void;
};

const ReservationItem = ({
  reservation,
  openDetailedModal,
}: ReservationItemProps) => {
  return (
    <Card size={"sm"}>
      <CardHeader>
        <Heading size="md">{`Réservation de ${reservation.userSnapshot.firstName} ${reservation.userSnapshot.name}`}</Heading>
      </CardHeader>
      <CardBody>
        <Image
          src={reservation.hotelRoom.imageUrl}
          borderRadius="sm"
          width="100%"
          height="150px"
          objectFit="cover"
        />

        <Spacer height={6} />

        <Flex flexWrap={"wrap"} gap={"0.8rem"}>
          <Tag>
            <img src={calendarStartSvg} width="16px" height="16px" />
            &ensp;
            {`Début ${moment(reservation.startDate).format(DATE_FORMAT)}`}
          </Tag>
          <Tag>
            <img src={calendarEndSvg} width="16px" height="16px" />
            &ensp;
            {`Fin ${moment(reservation.endDate).format(DATE_FORMAT)}`}
          </Tag>
        </Flex>

        <Spacer height={"0.8rem"} />

        <Flex flexWrap={"wrap"} gap={"0.8rem"}>
          <Tag>
            <img src={bedSvg} width="16px" height="16px" />
            &ensp;
            {`${CATEGORY_ROOM_LABELS[reservation.hotelRoom.category]}`}
          </Tag>
        </Flex>

        <Spacer height={"0.8rem"} />

        <Flex flexWrap={"wrap"} gap={"0.8rem"}>
          <Tag>
            <img src={accountSvg} width="16px" height="16px" />
            &ensp;
            {`Adulte(s): ${reservation.numberOfAdults}`}
          </Tag>
          {reservation.numberOfChildren > 0 && (
            <Tag>
              <img src={childSvg} width="16px" height="16px" />
              &ensp;
              {`Enfant(s): ${reservation.numberOfChildren}`}
            </Tag>
          )}
        </Flex>

        <Spacer height={"0.8rem"} />

        <Tag>{`${RESERVATION_STATUS_LABELS[reservation.status]}`}</Tag>
      </CardBody>
      <CardFooter>
        <Button
          size={"sm"}
          colorScheme="primary"
          onClick={() => openDetailedModal(reservation)}
        >
          {"voir le détail"}
        </Button>
      </CardFooter>
    </Card>
  );
};
export default ReservationItem;
