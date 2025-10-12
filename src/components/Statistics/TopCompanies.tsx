import { Box, Heading, Text } from "@chakra-ui/react";
import { CompanyTop } from "../../interfaces/Statistics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

export interface TopCompaniesProps {
  items: CompanyTop[];
  isLoading?: boolean;
  error?: string;
}

const colors = ["#805AD5", "#667EEA", "#63B3ED", "#48BB78", "#ED8936"]; // purple, indigo, blue, green, orange

const formatCurrency = (v: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);

const TopCompanies = ({ items, isLoading, error }: TopCompaniesProps) => {
  const data = (items || []).slice().sort((a, b) => b.revenue - a.revenue).map((c) => ({
    name: c.companyName || "(Sans nom)",
    revenue: c.revenue,
    reservations: c.reservations,
    roomNights: c.roomNights,
  }));

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="white">
      <Heading as="h4" size="sm" mb={2}>Top entreprises</Heading>
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
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => formatCurrency(Number(v))} />
              <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any, name: any) => {
                if (name === "revenue") return [formatCurrency(Number(value)), "Revenus"];
                if (name === "reservations") return [value, "Réservations"];
                if (name === "roomNights") return [value, "Nuits"];
                return [value, name];
              }} />
              <Bar dataKey="revenue" name="Revenus">
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

export default TopCompanies;
