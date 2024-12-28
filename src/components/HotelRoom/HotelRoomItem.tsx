import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Tag,
  Image,
} from "@chakra-ui/react";
import { HotelRoom } from "../../interfaces/HotelRoom";
import { CATEGORY_ROOM_LABELS } from "../../data/HotelRoom";

type HotelRoomItemProps = {
  hotelRoom: HotelRoom;
  openDetailedModal: (hotelRoom: HotelRoom) => void;
};

const HotelRoomItem = ({
  hotelRoom,
  openDetailedModal,
}: HotelRoomItemProps) => {
  return (
    <Card size={"sm"}>
      <CardBody>
        <Image
          src={hotelRoom.imageUrl}
          borderRadius="sm"
          width="100%"
          height="150px"
          objectFit="cover"
        />
        <CardHeader display={"flex"} gap="2rem">
          <Heading size="md">{`Chambre n°${hotelRoom.roomNumber}`} </Heading>
          {hotelRoom.available ? (
            <Tag colorScheme="green">{"Libre"}</Tag>
          ) : (
            <Tag>{"Réservée"}</Tag>
          )}
        </CardHeader>

        <Flex gap={"0.8rem"}>
          <Tag>{`${CATEGORY_ROOM_LABELS[hotelRoom.category]}`}</Tag>
          <Tag>{`${hotelRoom.price} DZD`}</Tag>
        </Flex>
      </CardBody>
      <CardFooter>
        <Button
          size={"sm"}
          colorScheme="primary"
          onClick={() => openDetailedModal(hotelRoom)}
        >
          {"voir le détail"}
        </Button>
      </CardFooter>
    </Card>
  );
};
export default HotelRoomItem;
