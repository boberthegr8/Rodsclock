import React, { useMemo } from 'react';
import { Shift } from '../types';
import { getShiftDuration, formatDuration } from '../utils/dateUtils';
import { isSameDay, startOfWeek, endOfWeek, isWithinInterval, parseISO, startOfMonth, endOfMonth } from 'date-fns';

interface StatsPanelProps {
  shifts: Shift[];
  currentDate: Date;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ shifts, currentDate }) => {
  
  const stats = useMemo(() => {
    let todayMins = 0;
    let weekMins = 0;
    let monthMins = 0;

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    shifts.forEach(shift => {
      if (!shift.end) return; // Don't count currently ticking shift in static totals to avoid confusion, or calculate partial? Let's stick to completed.

      const duration = getShiftDuration(shift.start, shift.end);
      const shiftDate = parseISO(shift.start);

      // Today
      if (isSameDay(shiftDate, currentDate)) {
        todayMins += duration;
      }

      // Week
      if (isWithinInterval(shiftDate, { start: weekStart, end: weekEnd })) {
        weekMins += duration;
      }

      // Month (Calendar month, not reporting period, for general utility)
      if (isWithinInterval(shiftDate, { start: monthStart, end: monthEnd })) {
        monthMins += duration;
      }
    });

    return { todayMins, weekMins, monthMins };
  }, [shifts, currentDate]);

  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Today</div>
        <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{formatDuration(stats.todayMins)}</div>
      </div>
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Week</div>
        <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{formatDuration(stats.weekMins)}</div>
      </div>
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Month</div>
        <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{formatDuration(stats.monthMins)}</div>
      </div>
    </div>
  );
};
