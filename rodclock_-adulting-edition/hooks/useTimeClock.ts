import { useState, useEffect, useCallback } from 'react';
import { Shift, AppStatus } from '../types';
import { getReportingPeriodId } from '../utils/dateUtils';

const STORAGE_KEY = 'swiftclock_shifts';

export const useTimeClock = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedShifts: Shift[] = JSON.parse(stored);
        setShifts(parsedShifts);
        
        // Find active shift
        const active = parsedShifts.find(s => s.end === null);
        if (active) {
          setActiveShiftId(active.id);
        }
      }
    } catch (e) {
      console.error("Failed to load shifts", e);
    }
  }, []);

  // Save to LocalStorage whenever shifts change
  useEffect(() => {
    if (shifts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shifts));
    }
  }, [shifts]);

  const clockIn = useCallback(() => {
    if (activeShiftId) return;

    const now = new Date();
    const newShift: Shift = {
      id: crypto.randomUUID(),
      start: now.toISOString(),
      end: null,
      note: '',
      periodId: getReportingPeriodId(now)
    };

    setShifts(prev => [newShift, ...prev]);
    setActiveShiftId(newShift.id);
  }, [activeShiftId]);

  const clockOut = useCallback((customDate?: Date) => {
    if (!activeShiftId) return;

    const endDate = customDate || new Date();

    setShifts(prev => prev.map(s => {
      if (s.id === activeShiftId) {
        return { ...s, end: endDate.toISOString() };
      }
      return s;
    }));
    setActiveShiftId(null);
  }, [activeShiftId]);

  const undoLastAction = useCallback(() => {
    setShifts(prev => {
      if (prev.length === 0) return prev;
      
      const [mostRecent, ...rest] = prev;
      
      // Case 1: We are currently clocked in. The last action was "Clock In".
      // Action: Delete the active shift completely.
      if (mostRecent.end === null) {
         setActiveShiftId(null);
         return rest;
      }

      // Case 2: We are currently clocked out. The last action was "Clock Out".
      // Action: Reopen the most recent shift (set end to null).
      const reopenedShift = { ...mostRecent, end: null };
      setActiveShiftId(reopenedShift.id);
      return [reopenedShift, ...rest];
    });
  }, []);

  const updateShiftNote = useCallback((id: string, note: string) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, note } : s));
  }, []);

  const clearArchive = useCallback((periodId: string) => {
    setShifts(prev => prev.filter(s => s.periodId !== periodId));
  }, []);

  const getActiveShift = () => shifts.find(s => s.id === activeShiftId);

  return {
    shifts,
    activeShift: getActiveShift(),
    clockIn,
    clockOut,
    undoLastAction,
    updateShiftNote,
    clearArchive,
    isClockedIn: !!activeShiftId
  };
};
