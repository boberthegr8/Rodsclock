import React from 'react';
import { Shift } from '../types';
import { getShiftDateLabel, getShiftTimeLabel, getShiftDuration, formatDuration, formatDecimalDuration } from '../utils/dateUtils';
import { Edit2 } from 'lucide-react';

interface LogTableProps {
  shifts: Shift[];
  onUpdateNote: (id: string, note: string) => void;
}

export const LogTable: React.FC<LogTableProps> = ({ shifts, onUpdateNote }) => {
  
  if (shifts.length === 0) {
    return <div className="text-center py-8 text-slate-400 italic">No history for this period.</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-300 uppercase">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-2 py-3">In</th>
              <th className="px-2 py-3">Out</th>
              <th className="px-2 py-3 text-right">Dur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {shifts.map((shift) => {
              const isCompleted = !!shift.end;
              const duration = isCompleted ? getShiftDuration(shift.start, shift.end!) : 0;
              
              return (
                <React.Fragment key={shift.id}>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-slate-800 dark:text-slate-200">
                      {getShiftDateLabel(shift.start)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-green-700 dark:text-green-400">
                      {getShiftTimeLabel(shift.start)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-red-700 dark:text-red-400">
                      {isCompleted ? getShiftTimeLabel(shift.end!) : '...'}
                    </td>
                    <td className="px-2 py-3 text-right font-bold text-slate-700 dark:text-slate-300">
                      {isCompleted ? formatDuration(duration) : '-'}
                    </td>
                  </tr>
                  {/* Note Row */}
                  <tr>
                    <td colSpan={4} className="px-4 pb-3 pt-0">
                      <div className="flex items-center gap-2">
                        <Edit2 className="w-3 h-3 text-slate-400" />
                        <input
                          type="text"
                          className="w-full bg-transparent text-xs text-slate-500 focus:text-slate-800 dark:focus:text-slate-200 focus:outline-none placeholder:italic"
                          placeholder="Add note..."
                          value={shift.note || ''}
                          onChange={(e) => onUpdateNote(shift.id, e.target.value)}
                        />
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
