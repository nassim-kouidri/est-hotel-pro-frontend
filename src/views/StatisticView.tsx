import { Box, Heading, Flex, Divider, SimpleGrid, Text } from "@chakra-ui/react";
import PageContainer from "../layout/PageContainer";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/auth";
import { StatisticsService } from "../services/StatisticsService";
import { OverviewStatsResponse, DailyOccupancyPoint, DailyReservationPoint, CategorySlice, PaymentStatusSlice, CompanyTop } from "../interfaces/Statistics";
import DateRangePicker from "../components/Statistics/DateRangePicker";
import KpiCards from "../components/Statistics/KpiCards";
import OccupancyLineChart from "../components/Statistics/OccupancyLineChart";
import ReservationsRevenueChart from "../components/Statistics/ReservationsRevenueChart";
import CategoryDistribution from "../components/Statistics/CategoryDistribution";
import PaymentStatusDistribution from "../components/Statistics/PaymentStatusDistribution";
import TopCompanies from "../components/Statistics/TopCompanies";
import ExportButtons from "../components/Statistics/ExportButtons";

const toIso = (d: Date) => d.toISOString().split("T")[0];

const StatisticView = () => {
  const { user } = useAuth();

  // Date range state: default to last 30 days [start, end)
  const today = useMemo(() => new Date(), []);
  const defaultEnd = useMemo(() => toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)), [today]);
  const defaultStart = useMemo(() => toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29)), [today]);
  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);

  // Data states
  const [overview, setOverview] = useState<OverviewStatsResponse | undefined>();
  const [occupancy, setOccupancy] = useState<DailyOccupancyPoint[]>([]);
  const [daily, setDaily] = useState<DailyReservationPoint[]>([]);
  const [categories, setCategories] = useState<CategorySlice[]>([]);
  const [payments, setPayments] = useState<PaymentStatusSlice[]>([]);
  const [companies, setCompanies] = useState<CompanyTop[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Fetch all datasets when user or date range changes
  useEffect(() => {
    if (!user) return;
    const ac = new AbortController();
    const token = user.token;
    setLoading(true);
    setError(undefined);

    Promise.all([
      StatisticsService.getOverview(token, startDate, endDate, ac.signal),
      StatisticsService.getDailyOccupancy(token, startDate, endDate, ac.signal),
      StatisticsService.getDailyReservations(token, startDate, endDate, ac.signal),
      StatisticsService.getCategorySlice(token, startDate, endDate, ac.signal),
      StatisticsService.getPaymentStatusSlice(token, startDate, endDate, ac.signal),
      StatisticsService.getTopCompanies(token, startDate, endDate, 5, ac.signal),
    ])
      .then(([ov, occ, dres, cat, pay, top]) => {
        setOverview(ov.data);
        setOccupancy(occ.data);
        setDaily(dres.data);
        setCategories(cat.data);
        setPayments(pay.data);
        setCompanies(top.data);
      })
      .catch((e) => {
        if (e?.message && e.name !== "CanceledError") setError("Erreur lors du chargement des statistiques");
        // eslint-disable-next-line no-console
        console.error("Statistics load error", e);
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [user, startDate, endDate]);

  // CSV export helpers
  const exportCsv = (filename: string, rows: string[][]) => {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onExportOccupancy = () => {
    const rows: string[][] = [["date", "occupancyRate", "occupiedRoomNights"]];
    occupancy.forEach((p) => rows.push([p.date, String(p.occupancyRate), String(p.occupiedRoomNights)]));
    exportCsv(`occupation_${startDate}_${endDate}.csv`, rows);
  };

  const onExportReservations = () => {
    const rows: string[][] = [["date", "reservations", "revenue"]];
    daily.forEach((p) => rows.push([p.date, String(p.reservations), String(p.revenue)]));
    exportCsv(`reservations_revenus_${startDate}_${endDate}.csv`, rows);
  };

  return (
    <PageContainer>
      <Box maxWidth="1200px" mx="auto" p={6}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4} mb={4}>
          <Heading as="h2" size="lg" fontWeight="medium">Statistiques</Heading>
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
        </Flex>

        <Divider my={4} />

        {/* KPI Cards */}
        <Box mb={8}>
          <KpiCards data={overview} isLoading={loading} />
        </Box>

        {/* Time series */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
          <OccupancyLineChart points={occupancy} isLoading={loading} error={error} />
          <ReservationsRevenueChart points={daily} isLoading={loading} error={error} />
        </SimpleGrid>

        <Flex justify="flex-end" mb={6}>
          <ExportButtons onExportOccupancy={onExportOccupancy} onExportReservations={onExportReservations} />
        </Flex>

        {/* Distributions */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <CategoryDistribution slices={categories} isLoading={loading} error={error} />
          <PaymentStatusDistribution slices={payments} isLoading={loading} error={error} />
        </SimpleGrid>

        <Box mt={6}>
          <TopCompanies items={companies} isLoading={loading} error={error} />
        </Box>

        {!loading && error && (
          <Text mt={4} color="red.500">{error}</Text>
        )}
      </Box>
    </PageContainer>
  );
};

export default StatisticView;
