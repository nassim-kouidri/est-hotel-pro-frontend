import { Box, Heading, Text } from "@chakra-ui/react";
import { DailyOccupancyPoint } from "../../interfaces/Statistics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface OccupancyLineChartProps {
  points: DailyOccupancyPoint[];
  isLoading?: boolean;
  error?: string;
}

const OccupancyLineChart = ({ points, isLoading, error }: OccupancyLineChartProps) => {
  const data = (points || []).map((p) => ({
    date: p.date,
    occupancyPct: Math.round((p.occupancyRate || 0) * 1000) / 10, // 0..100 with 0.1 precision
    roomNights: p.occupiedRoomNights,
  }));

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="white">
      <Heading as="h4" size="sm" mb={2}>Occupation quotidienne</Heading>
      {isLoading && <Text>Chargement…</Text>}
      {error && <Text color="red.500">{error}</Text>}
      {!isLoading && !error && data.length === 0 && (
        <Text fontSize="sm" color="gray.600">Aucune donnée</Text>
      )}
      {!isLoading && !error && data.length > 0 && (
        <Box height="280px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value: any, name: any, props: any) => {
                if (name === "occupancyPct") return [`${value}%`, "Occupation"];
                if (name === "roomNights") return [value, "Nuits occupées"];
                return [value, name];
              }} labelFormatter={(label) => `Date: ${label}`} />
              <Line type="monotone" dataKey="occupancyPct" stroke="#3182CE" strokeWidth={2} dot={false} name="Occupation" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default OccupancyLineChart;
