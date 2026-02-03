import React, { useState, useEffect, useMemo } from 'react';
import { Clock, PlayCircle, StopCircle, Undo2, AlertTriangle, X } from 'lucide-react';
import { useTimeClock } from './hooks/useTimeClock';
import { StatsPanel } from './components/StatsPanel';
import { LogTable } from './components/LogTable';
import { ArchiveControls } from './components/ArchiveControls';
import { getReportingPeriodId, isStaleShift, FORMAT_TIME, FORMAT_DATE_DISPLAY, getShiftDuration } from './utils/dateUtils';
import { format } from 'date-fns';

export default function App() {
  const { 
    shifts, 
    activeShift, 
    clockIn, 
    clockOut, 
    undoLastAction, 
    updateShiftNote,
    clearArchive
  } = useTimeClock();

  const [now, setNow] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [showManualOut, setShowManualOut] = useState(false);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine available periods
  const periods = useMemo(() => {
    const unique = Array.from(new Set(shifts.map(s => s.periodId)));
    const current = getReportingPeriodId(new Date());
    if (!unique.includes(current)) unique.push(current);
    // Sort descending
    return unique.sort().reverse();
  }, [shifts]);

  // Default selection to current period on load
  useEffect(() => {
    if (!selectedPeriod && periods.length > 0) {
      setSelectedPeriod(periods[0]);
    }
  }, [periods, selectedPeriod]);

  // Derived state
  const isClockedIn = !!activeShift;
  const currentPeriodId = getReportingPeriodId(now);
  const isCurrentPeriod = selectedPeriod === currentPeriodId;
  
  // Filter shifts for the view
  const visibleShifts = useMemo(() => {
    return shifts
      .filter(s => s.periodId === selectedPeriod)
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()); // Newest first
  }, [shifts, selectedPeriod]);

  // Stale Shift Detection
  const staleShift = useMemo(() => {
    if (activeShift && isStaleShift(activeShift.start)) {
      return activeShift;
    }
    return null;
  }, [activeShift]);

  // Active Duration Calculation
  const activeDuration = activeShift 
    ? getShiftDuration(activeShift.start, now.toISOString()) 
    : 0;

  const activeDurationLabel = useMemo(() => {
    const h = Math.floor(activeDuration / 60);
    const m = activeDuration % 60;
    return `${h}h ${m}m`;
  }, [activeDuration]);

  // Handlers
  const handleClockOut = () => {
    if (confirm("Confirm Clock Out?")) {
      clockOut();
    }
  };

  const handleManualClockOut = (date: Date) => {
    clockOut(date);
    setShowManualOut(false);
  };

  const handleUndo = () => {
    if (confirm("Undo the last punch action? This will revert your status.")) {
      undoLastAction();
    }
  };

  return (
    <div className="min-h-screen pb-12 max-w-md mx-auto bg-slate-50 dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 shadow-2xl relative">
      
      {/* Header */}
      <header className="pt-8 pb-4 px-6 text-center">
        <h1 className="text-xl font-black text-slate-700 dark:text-slate-200 mb-1">
          RodClock: Adulting Edition
        </h1>
        <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">
          {format(now, FORMAT_DATE_DISPLAY)}
        </div>
        <div className="text-5xl font-black text-slate-800 dark:text-white mt-1 tabular-nums tracking-tight">
          {format(now, FORMAT_TIME)}
        </div>
        <div className="mt-2 h-6">
          {isClockedIn ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold animate-pulse">
              CLOCKED IN • {activeDurationLabel}
            </span>
          ) : (
             <span className="text-slate-400 text-sm font-medium">Clocked Out</span>
          )}
        </div>
      </header>

      {/* Warning Banner for Stale Shift */}
      {staleShift && (
        <div className="mx-4 mb-4 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 p-4 rounded-xl flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-orange-800 dark:text-orange-200">Forgot to Clock Out?</h3>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                You are still clocked in from {format(new Date(staleShift.start), 'MMM d')}.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => clockOut()} 
              className="flex-1 bg-orange-600 text-white text-xs font-bold py-2 rounded-lg"
            >
              Out Now
            </button>
            <button 
              onClick={() => setShowManualOut(true)} 
              className="flex-1 bg-white dark:bg-slate-800 border border-orange-300 text-orange-700 dark:text-orange-300 text-xs font-bold py-2 rounded-lg"
            >
              Pick Time
            </button>
          </div>
        </div>
      )}

      {/* Manual Time Modal */}
      {showManualOut && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg dark:text-white">Set Clock Out Time</h3>
              <button onClick={() => setShowManualOut(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <input 
              type="datetime-local" 
              className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-700 dark:text-white mb-4"
              onChange={(e) => {
                if(e.target.value) handleManualClockOut(new Date(e.target.value));
              }}
            />
            <p className="text-xs text-slate-500 text-center">Select date and time to finish shift.</p>
          </div>
        </div>
      )}

      {/* Main Buttons */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-2">
        <button
          onClick={clockIn}
          disabled={isClockedIn}
          className={`
            relative overflow-hidden group flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg transition-all active:scale-95
            ${isClockedIn 
              ? 'bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed grayscale' 
              : 'bg-green-500 hover:bg-green-600 text-white ring-4 ring-green-500/20'
            }
          `}
        >
          <PlayCircle className="w-10 h-10 mb-2" />
          <span className="text-lg font-black tracking-tight">IN</span>
        </button>

        <button
          onClick={handleClockOut}
          disabled={!isClockedIn}
          className={`
            relative overflow-hidden group flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg transition-all active:scale-95
            ${!isClockedIn 
              ? 'bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed grayscale' 
              : 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-500/20'
            }
          `}
        >
          <StopCircle className="w-10 h-10 mb-2" />
          <span className="text-lg font-black tracking-tight">OUT</span>
        </button>
      </div>

      {/* Undo Button */}
      <div className="px-4 mb-8 flex justify-end">
        <button 
          onClick={handleUndo}
          disabled={shifts.length === 0}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-0"
        >
          <Undo2 className="w-3 h-3" /> Undo Last
        </button>
      </div>

      {/* Stats & Logs */}
      <div className="px-4">
        <StatsPanel shifts={visibleShifts} currentDate={now} />
        
        <ArchiveControls 
          periods={periods}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
          filteredShifts={visibleShifts}
          isCurrentPeriod={isCurrentPeriod}
          onClearArchive={() => clearArchive(selectedPeriod)}
        />

        <LogTable shifts={visibleShifts} onUpdateNote={updateShiftNote} />
      </div>

      <div className="h-10"></div>
    </div>
  );
}