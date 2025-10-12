import { Box, Button, Flex, FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import { useMemo } from "react";

export interface DateRangePickerProps {
  startDate: string; // ISO yyyy-MM-dd
  endDate: string;   // ISO yyyy-MM-dd
  onChange: (startDate: string, endDate: string) => void;
  presetsEnabled?: boolean;
}

const toIso = (d: Date) => d.toISOString().split("T")[0];

const DateRangePicker = ({ startDate, endDate, onChange, presetsEnabled = true }: DateRangePickerProps) => {
  const presets = useMemo(() => {
    const today = new Date();
    const addDays = (base: Date, n: number) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + n);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    return [
      { label: "Aujourd'hui", start: toIso(today), end: toIso(addDays(today, 1)) },
      { label: "7 jours", start: toIso(addDays(today, -6)), end: toIso(addDays(today, 1)) },
      { label: "30 jours", start: toIso(addDays(today, -29)), end: toIso(addDays(today, 1)) },
      { label: "Ce mois", start: toIso(startOfMonth), end: toIso(addDays(new Date(today.getFullYear(), today.getMonth() + 1, 1), 0)) },
      { label: "Cette année", start: toIso(startOfYear), end: toIso(addDays(new Date(today.getFullYear() + 1, 0, 1), 0)) },
    ];
  }, []);

  return (
    <Box>
      <HStack spacing={4} align="flex-end">
        <FormControl>
          <FormLabel>Début</FormLabel>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onChange(e.target.value, endDate)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Fin</FormLabel>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onChange(startDate, e.target.value)}
          />
        </FormControl>
      </HStack>
      {presetsEnabled && (
        <Flex mt={2} wrap="wrap" gap={2}>
          {presets.map((p) => (
            <Button key={p.label} size="sm" onClick={() => onChange(p.start, p.end)}>
              {p.label}
            </Button>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default DateRangePicker;
