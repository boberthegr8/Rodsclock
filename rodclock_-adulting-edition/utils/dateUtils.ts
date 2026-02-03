import { 
  format, 
  parseISO, 
  differenceInMinutes, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  startOfDay, 
  addDays,
  isBefore
} from 'date-fns';

// Formats
export const FORMAT_TIME = 'h:mm a';
export const FORMAT_DATE_DISPLAY = 'EEE MMM d, yyyy';
export const FORMAT_ISO_DATE = 'yyyy-MM-dd';

// Calculate the "Reporting Period" for a given date.
// Rule: A date belongs to the month of the Monday of its week.
export const getReportingPeriodId = (date: Date): string => {
  // Get Monday of the week (week starts on Monday = 1)
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  return format(monday, 'yyyy-MM');
};

export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

export const formatDecimalDuration = (minutes: number): string => {
  return (minutes / 60).toFixed(2);
};

export const getShiftDuration = (startIso: string, endIso: string | null): number => {
  const start = parseISO(startIso);
  const end = endIso ? parseISO(endIso) : new Date();
  return differenceInMinutes(end, start);
};

// Check if a shift is from a previous day (simple check for "forgot to clock out")
export const isStaleShift = (startIso: string): boolean => {
  const start = parseISO(startIso);
  const now = new Date();
  // If start was before today's start of day
  return isBefore(start, startOfDay(now));
};

export const getShiftDateLabel = (isoString: string) => {
  return format(parseISO(isoString), FORMAT_DATE_DISPLAY);
};

export const getShiftTimeLabel = (isoString: string) => {
  return format(parseISO(isoString), FORMAT_TIME);
};
