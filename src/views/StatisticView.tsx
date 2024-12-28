import { Heading } from "@chakra-ui/react";
import ReservationChart from "../components/Reservation/ReservationChart";
import PageContainer from "../layout/PageContainer";

const StatisticView = () => {
  return (
    <PageContainer>
      <Heading>{"Statistiques"}</Heading>
      <ReservationChart />
    </PageContainer>
  );
};

export default StatisticView;
