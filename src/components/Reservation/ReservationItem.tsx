import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
  Box,
  Text,
  useColorModeValue,
  HStack,
  VStack,

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
  // Color mode values for consistent theming
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  // Determine status color and label
  const getStatusInfo = (status: string) => {
    switch(status) {
      case "COMING":
        return { 
          color: "teal", 
          label: RESERVATION_STATUS_LABELS["COMING"],
          bg: useColorModeValue("teal.50", "teal.900")
        };
      case "IN_PROGRESS":
        return { 
          color: "orange", 
          label: RESERVATION_STATUS_LABELS["IN_PROGRESS"],
          bg: useColorModeValue("orange.50", "orange.900")
        };
      default:
        return { 
          color: "gray", 
          label: RESERVATION_STATUS_LABELS["ENDED"],
          bg: useColorModeValue("gray.50", "gray.700")
        };
    }
  };

  const statusInfo = getStatusInfo(reservation.status.toString());

  return (
    <Card 
      size={"sm"} 
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.3s"
      _hover={{ 
        transform: "translateY(-4px)", 
        boxShadow: "md",
        borderColor: `${statusInfo.color}.300`
      }}
      position="relative"
    >
      {/* Status Badge - Prominently displayed at the top */}
      <Box 
        position="absolute" 
        top="0" 
        right="0" 
        bg={statusInfo.bg} 
        color={`${statusInfo.color}.600`}
        px={3}
        py={1}
        borderBottomLeftRadius="md"
        fontWeight="medium"
        fontSize="sm"
      >
        {statusInfo.label}
      </Box>

      <CardHeader pb={2}>
        <Heading size="md" color={textColor}>
          {`${reservation.userSnapshot.firstName} ${reservation.userSnapshot.name}`}
        </Heading>
      </CardHeader>

      <CardBody pt={0}>
        <Box position="relative">
          <Image
            src={reservation.hotelRoom.imageUrl}
            borderRadius="md"
            width="100%"
            height="150px"
            objectFit="cover"
          />

          {/* Room info overlay on the image */}
          <Box 
            position="absolute" 
            bottom="0" 
            left="0" 
            right="0" 
            bg="rgba(0,0,0,0.6)" 
            color="white"
            p={2}
            borderBottomRadius="md"
          >
            <Flex align="center">
              <Box as="img" src={bedSvg} width="16px" height="16px" mr={2} />
              <Text fontWeight="bold">
                {`${CATEGORY_ROOM_LABELS[reservation.hotelRoom.category]} - Chambre n°${reservation.hotelRoom.roomNumber}`}
              </Text>
            </Flex>
          </Box>
        </Box>

        <Box mt={4}>
          {/* Dates Section */}
          <Box 
            bg={sectionBg} 
            p={3} 
            borderRadius="md" 
            mb={3}
          >
            <HStack spacing={4} flexWrap="wrap">
              <VStack align="start" spacing={0} minW="120px">
                <Flex align="center">
                  <Box as="img" src={calendarStartSvg} width="16px" height="16px" mr={2} />
                  <Text fontSize="xs" color={mutedColor}>Arrivée</Text>
                </Flex>
                <Text fontWeight="medium">{moment(reservation.startDate).format(DATE_FORMAT)}</Text>
              </VStack>

              <VStack align="start" spacing={0} minW="120px">
                <Flex align="center">
                  <Box as="img" src={calendarEndSvg} width="16px" height="16px" mr={2} />
                  <Text fontSize="xs" color={mutedColor}>Départ</Text>
                </Flex>
                <Text fontWeight="medium">{moment(reservation.endDate).format(DATE_FORMAT)}</Text>
              </VStack>
            </HStack>
          </Box>

          {/* Guests Section */}
          <Box 
            bg={sectionBg} 
            p={3} 
            borderRadius="md"
          >
            <HStack spacing={4} flexWrap="wrap">
              <VStack align="start" spacing={0} minW="100px">
                <Flex align="center">
                  <Box as="img" src={accountSvg} width="16px" height="16px" mr={2} />
                  <Text fontSize="xs" color={mutedColor}>Adultes</Text>
                </Flex>
                <Text fontWeight="medium">{reservation.numberOfAdults}</Text>
              </VStack>

              {reservation.numberOfChildren > 0 && (
                <VStack align="start" spacing={0} minW="100px">
                  <Flex align="center">
                    <Box as="img" src={childSvg} width="16px" height="16px" mr={2} />
                    <Text fontSize="xs" color={mutedColor}>Enfants</Text>
                  </Flex>
                  <Text fontWeight="medium">{reservation.numberOfChildren}</Text>
                </VStack>
              )}
            </HStack>
          </Box>
        </Box>
      </CardBody>

      <CardFooter pt={2} justifyContent="flex-end">
        <Button
          size={"sm"}
          colorScheme="primary"
          onClick={() => openDetailedModal(reservation)}
          rightIcon={<Box as="span" fontSize="1.2em">→</Box>}
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
        >
          {"Voir le détail"}
        </Button>
      </CardFooter>
    </Card>
  );
};
export default ReservationItem;
