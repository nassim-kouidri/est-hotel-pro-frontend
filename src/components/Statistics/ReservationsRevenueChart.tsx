import { Box, Heading, Text } from "@chakra-ui/react";
import { DailyReservationPoint } from "../../interfaces/Statistics";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export interface ReservationsRevenueChartProps {
  points: DailyReservationPoint[];
  isLoading?: boolean;
  error?: string;
}

const ReservationsRevenueChart = ({ points, isLoading, error }: ReservationsRevenueChartProps) => {
  const data = (points || []).map((p) => ({
    date: p.date,
    reservations: p.reservations,
    revenue: Math.round((p.revenue || 0)),
  }));

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="white">
      <Heading as="h4" size="sm" mb={2}>Réservations & Revenus (quotidien)</Heading>
      {isLoading && <Text>Chargement…</Text>}
      {error && <Text color="red.500">{error}</Text>}
      {!isLoading && !error && data.length === 0 && (
        <Text fontSize="sm" color="gray.600">Aucune donnée</Text>
      )}
      {!isLoading && !error && data.length > 0 && (
        <Box height="280px">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(v))} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any, name: any) => {
                if (name === "revenue") return [new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(value)), "Revenus"];
                if (name === "reservations") return [value, "Réservations"];
                return [value, name];
              }} labelFormatter={(label) => `Date: ${label}`} />
              <Bar yAxisId="left" dataKey="revenue" barSize={18} fill="#63B3ED" name="Revenus" />
              <Line yAxisId="right" type="monotone" dataKey="reservations" stroke="#2D3748" strokeWidth={2} dot={false} name="Réservations" />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default ReservationsRevenueChart;
