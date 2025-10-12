import { Box, Heading, Text } from "@chakra-ui/react";
import { PaymentStatusSlice } from "../../interfaces/Statistics";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export interface PaymentStatusDistributionProps {
  slices: PaymentStatusSlice[];
  isLoading?: boolean;
  error?: string;
}

const labelMap: Record<string, string> = {
  FULLY_PAID: "Payé",
  PARTIALLY_PAID: "Partiellement payé",
  NOT_PAID: "Non payé",
};

const colors = ["#48BB78", "#F6AD55", "#E53E3E"]; // green, orange, red

const PaymentStatusDistribution = ({ slices, isLoading, error }: PaymentStatusDistributionProps) => {
  const data = (slices || []).map((s) => ({ name: labelMap[s.paymentStatus] ?? s.paymentStatus, value: s.count, revenue: s.revenue }));

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="white">
      <Heading as="h4" size="sm" mb={2}>Répartition par statut de paiement</Heading>
      {isLoading && <Text>Chargement…</Text>}
      {error && <Text color="red.500">{error}</Text>}
      {!isLoading && !error && data.length === 0 && (
        <Text fontSize="sm" color="gray.600">Aucune donnée</Text>
      )}
      {!isLoading && !error && data.length > 0 && (
        <Box height="280px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45} paddingAngle={2}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any, name: any, props: any) => [value, name]} />
              <Legend verticalAlign="bottom" height={24} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default PaymentStatusDistribution;
