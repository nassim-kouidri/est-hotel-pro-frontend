import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Text,
  Flex,
  IconButton,
  Heading,
  Center,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Select,
  HStack,
  Button,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { MonthlyCalendarResponse } from "../../interfaces/Reservation";
import { ReservationService } from "../../services/ReservationService";
import { useAuth } from "../../contexts/auth";
import { useToasts } from "../../contexts/toast";

const DAYS_OF_WEEK = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

interface ReservationCalendarProps {
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onDaySelect?: (date: string | null) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ onDateRangeChange, onDaySelect }) => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1); // JavaScript months are 0-indexed, API expects 1-indexed
  const [calendarData, setCalendarData] = useState<MonthlyCalendarResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { user } = useAuth();
  const { pushToast } = useToasts();

  useEffect(() => {
    fetchCalendarData();

    // Calculate first and last day of the month
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Format dates as YYYY-MM-DD without timezone conversion
    const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
    const endDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    // Notify parent component of date range change
    if (onDateRangeChange) {
      onDateRangeChange(startDate, endDate);
    }
  }, [currentYear, currentMonth]); // Removed onDateRangeChange to prevent duplicate API calls

  const fetchCalendarData = () => {
    if (user) {
      setIsLoading(true);
      ReservationService.getMonthlyCalendar(user.token, currentYear, currentMonth)
        .then((response) => {
          setCalendarData(response.data);
        })
        .catch(() => {
          pushToast({
            content: "Erreur lors de la récupération des données du calendrier",
            state: "ERROR",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    // Reset selected day when changing month
    setSelectedDay(null);
    if (onDaySelect) {
      onDaySelect(null);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    // Reset selected day when changing month
    setSelectedDay(null);
    if (onDaySelect) {
      onDaySelect(null);
    }
  };

  const handleDayClick = (day: number) => {
    // If the day is already selected, deselect it
    if (selectedDay === day) {
      setSelectedDay(null);
      if (onDaySelect) {
        onDaySelect(null);
      }
    } else {
      // Otherwise, select the day
      setSelectedDay(day);
      if (onDaySelect) {
        // Format the date as YYYY-MM-DD without timezone conversion
        const formattedDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onDaySelect(formattedDate);
      }
    }
  };

  const getDaysInMonth = (year: number, month: number): number => {
    // month is 1-indexed here
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    // month is 1-indexed here, but Date constructor expects 0-indexed
    return new Date(year, month - 1, 1).getDay();
  };

  const renderCalendar = () => {
    if (!calendarData) return null;

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    // Get today's date for highlighting
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() + 1 === currentMonth;
    const todayDate = today.getDate();

    // Create array of day cells
    const dayCells = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dayCells.push(
        <Box key={`empty-${i}`} p={2} borderWidth="1px" borderColor="gray.200" bg="gray.50" opacity={0.5}></Box>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const reservationCount = calendarData.dailyReservationCounts[day.toString()] || 0;
      const isSelected = selectedDay === day;
      const isToday = isCurrentMonth && day === todayDate;
      dayCells.push(
        <Box 
          key={day} 
          p={1} 
          borderWidth="1px" 
          borderColor={isSelected ? "primary.500" : isToday ? "blue.400" : "gray.200"}
          bg={isSelected ? "primary.50" : isToday ? "blue.50" : "white"}
          _hover={{ bg: isSelected ? "primary.100" : isToday ? "blue.100" : "gray.50" }}
          transition="all 0.2s"
          cursor="pointer"
          onClick={() => handleDayClick(day)}
        >
          <Flex direction="column" align="center">
            <Text fontWeight={isSelected || isToday ? "bold" : "medium"} fontSize="sm">{day}</Text>
            <Text 
              fontSize="xs" 
              color={reservationCount > 0 ? "primary.500" : isToday ? "blue.500" : "gray.500"}
              fontWeight={(reservationCount > 0 || isSelected || isToday) ? "bold" : "normal"}
            >
              {reservationCount}
            </Text>
          </Flex>
        </Box>
      );
    }

    return dayCells;
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" shadow="sm" maxWidth="100%" width="100%">
      <Flex justify="space-between" align="center" mb={4}>
        <IconButton
          aria-label="Mois précédent"
          icon={<ChevronLeftIcon />}
          onClick={goToPreviousMonth}
          colorScheme="primary"
          variant="ghost"
          size="sm"
        />
        <Popover placement="bottom" closeOnBlur={true}>
          <PopoverTrigger>
            <Button variant="ghost" size="md" fontWeight="bold" rightIcon={<Box as="span" fontSize="xs">▼</Box>}>
              {MONTHS[currentMonth - 1]} {currentYear}
            </Button>
          </PopoverTrigger>
          <PopoverContent width="250px">
            <PopoverBody p={4}>
              <Text fontWeight="medium" mb={2}>Sélectionner une date</Text>
              <HStack spacing={2}>
                <Select 
                  value={currentMonth} 
                  onChange={(e) => {
                    setCurrentMonth(parseInt(e.target.value));
                    setSelectedDay(null);
                    if (onDaySelect) onDaySelect(null);
                  }}
                  size="sm"
                >
                  {MONTHS.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </Select>
                <Select 
                  value={currentYear} 
                  onChange={(e) => {
                    setCurrentYear(parseInt(e.target.value));
                    setSelectedDay(null);
                    if (onDaySelect) onDaySelect(null);
                  }}
                  size="sm"
                >
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Select>
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <IconButton
          aria-label="Mois suivant"
          icon={<ChevronRightIcon />}
          onClick={goToNextMonth}
          colorScheme="primary"
          variant="ghost"
          size="sm"
        />
      </Flex>

      <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={2}>
        {DAYS_OF_WEEK.map((day) => (
          <Center key={day} p={1} fontWeight="bold" color="gray.600" fontSize="xs">
            {day}
          </Center>
        ))}
      </Grid>

      {isLoading ? (
        <Center p={6}>
          <Spinner color="primary.500" size="md" />
        </Center>
      ) : (
        <Grid templateColumns="repeat(7, 1fr)" gap={1}>
          {renderCalendar()}
        </Grid>
      )}
    </Box>
  );
};

export default ReservationCalendar;
