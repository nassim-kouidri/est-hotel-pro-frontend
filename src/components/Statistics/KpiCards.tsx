import { SimpleGrid, Box, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue } from "@chakra-ui/react";
import { OverviewStatsResponse } from "../../interfaces/Statistics";

export interface KpiCardsProps {
  data?: OverviewStatsResponse;
  isLoading?: boolean;
  error?: string;
}

const formatPercent = (v: number | undefined) =>
  typeof v === "number" ? new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 1 }).format(v) : "-";

const formatCurrency = (v: number | undefined) =>
  typeof v === "number" ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v) : "-";

const KpiCards = ({ data, isLoading }: KpiCardsProps) => {
  const cardBg = useColorModeValue("white", "gray.700");

  const items = [
    { label: "Total réservations", value: data?.totalReservations?.toString() ?? "-" },
    { label: "Revenus", value: formatCurrency(data?.revenue) },
    { label: "Taux d'occupation", value: formatPercent(data?.occupancyRate) },
    { label: "ADR", value: formatCurrency(data?.adr) },
    { label: "RevPAR", value: formatCurrency(data?.revpar) },
    { label: "Durée moyenne (nuits)", value: data?.avgLengthOfStay?.toFixed?.(1) ?? "-" },
    { label: "Part entreprise", value: formatPercent(data?.contractedShare) },
    { label: "Revenus entreprise", value: formatCurrency(data?.contractedRevenue) },
  ];

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
      {items.map((it) => (
        <Box key={it.label} p={4} bg={cardBg} borderWidth="1px" borderRadius="md" boxShadow="sm">
          <Stat>
            <StatLabel>{it.label}</StatLabel>
            <StatNumber>{isLoading ? "..." : it.value}</StatNumber>
            <StatHelpText></StatHelpText>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default KpiCards;
