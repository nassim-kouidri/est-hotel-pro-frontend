import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Label,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { ReservationService } from "../../services/ReservationService";
import { useAuth } from "../../contexts/auth";
import { ReservationChartData } from "../../interfaces/Reservation";
import moment from "moment";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import { useToasts } from "../../contexts/toast";

const ReservationChart = () => {
  const [reservations, setReservations] = useState<
    { date: string; count: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const { user } = useAuth();
  const { pushToast } = useToasts();

  useEffect(() => {
    fetchAllReservationsChart();
  }, []);

  const fetchAllReservationsChart = () => {
    if (user) {
      setIsLoading(true);
      setHasError(false);

      ReservationService.getAllReservationsForChart(user.token)
        .then((res) => {
          const transformedData = res.data.reduce(
            (
              acc: { date: string; count: number }[],
              reservation: ReservationChartData
            ) => {
              const date = moment(reservation.startDate).format("DD/MM/YYYY");
              const existingDate = acc.find((item) => item.date === date);
              if (existingDate) {
                existingDate.count += 1;
              } else {
                acc.push({ date, count: 1 });
              }
              return acc;
            },
            []
          );

          // Sort data by date
          transformedData.sort((a, b) => {
            const dateA = moment(a.date, "DD/MM/YYYY");
            const dateB = moment(b.date, "DD/MM/YYYY");
            return dateA.diff(dateB);
          });

          setReservations(transformedData);
        })
        .catch((error) => {
          console.error("Error fetching chart data:", error);
          setHasError(true);
          pushToast({
            content: "Erreur lors de la récupération des données statistiques",
            state: "ERROR",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  if (isLoading) {
    return (
      <Center p={10} h="400px">
        <Spinner size="xl" color="primary.500" thickness="4px" />
      </Center>
    );
  }

  if (hasError) {
    return (
      <Center p={10} h="400px">
        <Text color="red.500" fontSize="lg">
          Une erreur est survenue lors du chargement des données statistiques.
        </Text>
      </Center>
    );
  }

  if (reservations.length === 0) {
    return (
      <Center p={10} h="400px">
        <Text color="gray.500" fontSize="lg">
          Aucune donnée de réservation disponible pour afficher le graphique.
        </Text>
      </Center>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={reservations}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#4A5568' }}
          tickMargin={10}
        >
          <Label 
            value="Date" 
            offset={0} 
            position="insideBottom" 
            fill="#4A5568"
            style={{ fontWeight: 500, fontSize: '14px' }}
          />
        </XAxis>
        <YAxis
          tickFormatter={(tick) => (Number.isInteger(tick) ? tick : "")}
          allowDecimals={false}
          tick={{ fill: '#4A5568' }}
          tickMargin={10}
        >
          <Label
            value="Nombre de réservations"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle", fontWeight: 500, fontSize: '14px' }}
            fill="#4A5568"
          />
        </YAxis>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            borderRadius: '4px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: 'none'
          }} 
        />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          wrapperStyle={{ paddingTop: '10px' }}
        />
        <Line
          type="monotone"
          dataKey="count"
          name="Nombre de réservations"
          stroke="#e49b0e"
          strokeWidth={2}
          dot={{ fill: '#e49b0e', r: 4 }}
          activeDot={{ r: 6, fill: '#e49b0e', stroke: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ReservationChart;
