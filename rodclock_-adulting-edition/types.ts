export interface Shift {
  id: string;
  start: string; // ISO String
  end: string | null; // ISO String or null if active
  note: string;
  periodId: string; // YYYY-MM representing the "Reporting Month"
}

export interface DailyTotal {
  date: string; // YYYY-MM-DD
  minutes: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  CLOCKED_IN = 'CLOCKED_IN'
}
