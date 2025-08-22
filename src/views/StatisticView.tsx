import { Box, Heading, Flex, Divider, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Icon, useColorModeValue } from "@chakra-ui/react";
import ReservationChart from "../components/Reservation/ReservationChart";
import PageContainer from "../layout/PageContainer";
// import logoImage from "../assets/logo-est-hotel-pro.png";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth";
import { ReservationService } from "../services/ReservationService";
import { FaChartLine, FaCalendarCheck, FaBed } from "react-icons/fa";

const StatisticView = () => {
  const [totalReservations, setTotalReservations] = useState<number>(0);
  const [activeReservations, setActiveReservations] = useState<number>(0);
  const { user } = useAuth();

  const cardBg = useColorModeValue("white", "gray.700");
  const statBg = useColorModeValue("primary.50", "primary.900");

  useEffect(() => {
    if (user) {
      // Fetch all reservations to get the total count
      ReservationService.getAllReservationsForChart(user.token)
        .then((res) => {
          setTotalReservations(res.data.length);
        })
        .catch((error) => {
          console.error("Error fetching reservation data:", error);
        });

      // Fetch active reservations (IN_PROGRESS)
      // Get today's date for startDate and a future date for endDate
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1); // One year from now
      const futureDateStr = futureDate.toISOString().split('T')[0];

      ReservationService.getAllReservations(
        user.token, 
        0, 
        1000, 
        "IN_PROGRESS", 
        undefined,
        undefined,
        undefined, 
        today, 
        futureDateStr
      )
        .then((res) => {
          setActiveReservations(res.data.totalElements);
        })
        .catch((error) => {
          console.error("Error fetching active reservations:", error);
        });
    }
  }, [user]);

  return (
    <PageContainer>
      <Box 
        maxWidth={"1500px"} 
        mx="auto" 
        p={6} 
        borderRadius="md" 
        boxShadow="sm" 
        bg="white"
      >
        <Flex direction="column" align="center" mb={4}>
          {/*<Image*/}
          {/*  src={logoImage}*/}
          {/*  alt="Est Hotel Pro Logo"*/}
          {/*  maxWidth="150px"*/}
          {/*  mb={4}*/}
          {/*/>*/}
          <Heading as="h2" size="lg" textAlign={"center"} fontWeight="medium">
            {"Statistiques"}
          </Heading>
        </Flex>

        <Divider my={4} />

        {/* Summary Stats */}
        <Box mb={8}>
          <Heading as="h3" size="md" mb={4} fontWeight="medium">
            {"Résumé"}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {/* Total Reservations */}
            <Box 
              p={5} 
              borderRadius="lg" 
              boxShadow="sm" 
              bg={cardBg}
              borderWidth="1px"
              borderColor="gray.200"
              transition="transform 0.3s"
              _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
            >
              <Flex align="center">
                <Box 
                  p={3} 
                  borderRadius="full" 
                  bg={statBg} 
                  color="primary.500"
                  mr={4}
                >
                  <Icon as={FaChartLine} boxSize={5} />
                </Box>
                <Stat>
                  <StatLabel fontSize="md" fontWeight="medium">Total des réservations</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color="primary.500">
                    {totalReservations}
                  </StatNumber>
                  <StatHelpText>Depuis la création</StatHelpText>
                </Stat>
              </Flex>
            </Box>

            {/* Active Reservations */}
            <Box 
              p={5} 
              borderRadius="lg" 
              boxShadow="sm" 
              bg={cardBg}
              borderWidth="1px"
              borderColor="gray.200"
              transition="transform 0.3s"
              _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
            >
              <Flex align="center">
                <Box 
                  p={3} 
                  borderRadius="full" 
                  bg={statBg} 
                  color="primary.500"
                  mr={4}
                >
                  <Icon as={FaCalendarCheck} boxSize={5} />
                </Box>
                <Stat>
                  <StatLabel fontSize="md" fontWeight="medium">Réservations en cours</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color="primary.500">
                    {activeReservations}
                  </StatNumber>
                  <StatHelpText>Actuellement</StatHelpText>
                </Stat>
              </Flex>
            </Box>

            {/* Occupancy Rate */}
            <Box 
              p={5} 
              borderRadius="lg" 
              boxShadow="sm" 
              bg={cardBg}
              borderWidth="1px"
              borderColor="gray.200"
              transition="transform 0.3s"
              _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
            >
              <Flex align="center">
                <Box 
                  p={3} 
                  borderRadius="full" 
                  bg={statBg} 
                  color="primary.500"
                  mr={4}
                >
                  <Icon as={FaBed} boxSize={5} />
                </Box>
                <Stat>
                  <StatLabel fontSize="md" fontWeight="medium">Taux d'occupation</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color="primary.500">
                    {activeReservations > 0 ? "Actif" : "Inactif"}
                  </StatNumber>
                  <StatHelpText>État actuel</StatHelpText>
                </Stat>
              </Flex>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Chart Section */}
        <Box mb={6}>
          <Heading as="h3" size="md" mb={4} fontWeight="medium">
            {"Évolution des réservations"}
          </Heading>
          <Text mb={4} color="gray.600">
            {"Ce graphique montre le nombre de réservations par jour."}
          </Text>
          <Box 
            p={4} 
            borderWidth="1px" 
            borderRadius="lg" 
            boxShadow="xs"
            bg="white"
          >
            <ReservationChart />
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default StatisticView;
