import React from 'react';
import { Shift } from '../types';
import { Download, Copy, Trash2, Archive } from 'lucide-react';
import { getShiftDuration, formatDecimalDuration, formatDuration, FORMAT_ISO_DATE, getShiftDateLabel, getShiftTimeLabel } from '../utils/dateUtils';
import { parseISO } from 'date-fns';

interface ArchiveControlsProps {
  periods: string[];
  selectedPeriod: string;
  onSelectPeriod: (p: string) => void;
  filteredShifts: Shift[];
  isCurrentPeriod: boolean;
  onClearArchive: () => void;
}

export const ArchiveControls: React.FC<ArchiveControlsProps> = ({ 
  periods, 
  selectedPeriod, 
  onSelectPeriod, 
  filteredShifts,
  isCurrentPeriod,
  onClearArchive
}) => {

  const generateCSV = () => {
    const headers = ['Date', 'Clock In', 'Clock Out', 'Duration (Hours)', 'Duration (HH:MM)', 'Notes'];
    const rows = filteredShifts.map(s => {
      if (!s.end) return [];
      const dur = getShiftDuration(s.start, s.end);
      return [
        `"${getShiftDateLabel(s.start)}"`,
        getShiftTimeLabel(s.start),
        getShiftTimeLabel(s.end),
        formatDecimalDuration(dur),
        formatDuration(dur),
        `"${s.note.replace(/"/g, '""')}"`
      ];
    }).filter(r => r.length > 0);

    // Add Totals
    const totalMinutes = filteredShifts.reduce((acc, s) => acc + (s.end ? getShiftDuration(s.start, s.end) : 0), 0);
    rows.push([]);
    rows.push(['TOTALS', '', '', formatDecimalDuration(totalMinutes), formatDuration(totalMinutes), '']);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return csvContent;
  };

  const handleExportCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `timesheet_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = () => {
    const lines = filteredShifts.map(s => {
      if (!s.end) return '';
      const dur = getShiftDuration(s.start, s.end);
      return `${getShiftDateLabel(s.start)}\t${getShiftTimeLabel(s.start)}\t${getShiftTimeLabel(s.end)}\t${formatDuration(dur)}\t${s.note}`;
    }).filter(l => l);
    
    // Add total
    const totalMinutes = filteredShifts.reduce((acc, s) => acc + (s.end ? getShiftDuration(s.start, s.end) : 0), 0);
    lines.push(`\nTOTALS\t\t\t${formatDuration(totalMinutes)}`);

    const text = `Date\tIn\tOut\tDuration\tNotes\n${lines.join('\n')}`;
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
  };

  const handleClear = () => {
    if (confirm(`Are you sure you want to permanently delete all logs for ${selectedPeriod}? This cannot be undone.`)) {
      onClearArchive();
    }
  };

  return (
    <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-xl mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Archive className="w-5 h-5 text-slate-500" />
          <select 
            value={selectedPeriod} 
            onChange={(e) => onSelectPeriod(e.target.value)}
            className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm w-full font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {periods.map(p => (
              <option key={p} value={p}>
                 {p} {p === periods[0] ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExportCSV}
            disabled={filteredShifts.length === 0}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-lg disabled:opacity-50"
          >
            <Download className="w-3 h-3" /> CSV
          </button>
          <button 
            onClick={handleCopyText}
            disabled={filteredShifts.length === 0}
            className="flex-1 flex items-center justify-center gap-1 bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold py-2 px-3 rounded-lg disabled:opacity-50"
          >
            <Copy className="w-3 h-3" /> Text
          </button>
          
          {!isCurrentPeriod && (
            <button 
              onClick={handleClear}
              className="flex items-center justify-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 text-xs font-bold py-2 px-3 rounded-lg ml-2"
              title="Delete Archive"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
