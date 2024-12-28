import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Label,
} from "recharts";
import { useEffect, useState } from "react";
import { ReservationService } from "../../services/ReservationService";
import { useAuth } from "../../contexts/auth";
import { ReservationChartData } from "../../interfaces/Reservation";
import moment from "moment";

const ReservationChart = () => {
  const [reservations, setReservations] = useState<
    { date: string; count: number }[]
  >([]);

  const { user } = useAuth();

  useEffect(() => {
    fetchAllReservationsChart();
  }, []);

  const fetchAllReservationsChart = () => {
    if (user) {
      ReservationService.getAllReservationsForChart(user.token).then((res) => {
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
        setReservations(transformedData);
      });
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={reservations}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date">
          <Label value="Date" offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis
          tickFormatter={(tick) => (Number.isInteger(tick) ? tick : "")}
          allowDecimals={false}
        >
          <Label
            value="Nombre de réservations"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          name="Nombre de réservations"
          stroke="#e49b0e"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ReservationChart;
