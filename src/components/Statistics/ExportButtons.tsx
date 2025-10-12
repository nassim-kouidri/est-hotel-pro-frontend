import { Button, ButtonGroup } from "@chakra-ui/react";

export interface ExportButtonsProps {
  onExportOccupancy?: () => void;
  onExportReservations?: () => void;
}

export default function ExportButtons({ onExportOccupancy, onExportReservations }: ExportButtonsProps) {
  return (
    <ButtonGroup size="sm" variant="outline">
      <Button onClick={onExportOccupancy}>Exporter Occupation (CSV)</Button>
      <Button onClick={onExportReservations}>Exporter Réservations/Revenus (CSV)</Button>
    </ButtonGroup>
  );
}
