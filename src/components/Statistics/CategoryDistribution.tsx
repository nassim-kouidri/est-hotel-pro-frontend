import { Box, Heading, Text } from "@chakra-ui/react";
import { CategorySlice } from "../../interfaces/Statistics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

export interface CategoryDistributionProps {
  slices: CategorySlice[];
  isLoading?: boolean;
  error?: string;
}

const colors = ["#3182CE", "#2B6CB0", "#63B3ED", "#90CDF4", "#A0AEC0"]; // simple, clean palette

const CategoryDistribution = ({ slices, isLoading, error }: CategoryDistributionProps) => {
  const data = (slices || []).map((s) => ({ category: s.category, roomNights: s.roomNights, reservations: s.reservations }));

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="white">
      <Heading as="h4" size="sm" mb={2}>Répartition par catégorie</Heading>
      {isLoading && <Text>Chargement…</Text>}
      {error && <Text color="red.500">{error}</Text>}
      {!isLoading && !error && data.length === 0 && (
        <Text fontSize="sm" color="gray.600">Aucune donnée</Text>
      )}
      {!isLoading && !error && data.length > 0 && (
        <Box height="280px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="category" type="category" width={140} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any, name: any) => {
                if (name === "roomNights") return [value, "Nuits occupées"];
                if (name === "reservations") return [value, "Réservations"];
                return [value, name];
              }} />
              <Bar dataKey="roomNights" name="Nuits occupées">
                {data.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default CategoryDistribution;
