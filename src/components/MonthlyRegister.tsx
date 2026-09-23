import React, { useState } from 'react';
import { Student, AttendanceDatabase, SchoolConfig } from '../types/student';
import {
  GUJARATI_MONTHS,
  toGujaratiDigits,
  getDaysInMonth,
  isSunday,
  getDayOfWeekName,
} from '../utils/gujarati';
import { Printer, Download, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface MonthlyRegisterProps {
  students: Student[];
  attendanceDb: AttendanceDatabase;
  onUpdateDayStatus: (dateStr: string, studentId: string, newStatus: 'P' | 'A' | 'L' | 'H') => void;
  onOpenPrint: () => void;
  schoolConfig: SchoolConfig;
}

export const MonthlyRegister: React.FC<MonthlyRegisterProps> = ({
  students,
  attendanceDb,
  onUpdateDayStatus,
  onOpenPrint,
  schoolConfig,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Month change helpers
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  const monthObj = GUJARATI_MONTHS.find(m => m.value === selectedMonth) || GUJARATI_MONTHS[8];

  // Calculate working days in month (excluding Sundays)
  let workingDaysCount = 0;
  daysArray.forEach(day => {
    if (!isSunday(selectedYear, selectedMonth, day)) {
      workingDaysCount++;
    }
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Roll No',
      'GR No',
      'Student Name',
      'Gender',
      ...daysArray.map(d => `${d}`),
      'Total Working Days',
      'Present Days',
      'Absent Days',
      'Attendance %',
    ];

    const rows = students.map(student => {
      let presentDays = 0;
      let absentDays = 0;

      const dayStatuses = daysArray.map(day => {
        const dayStr = String(day).padStart(2, '0');
        const monthStr = String(selectedMonth).padStart(2, '0');
        const dateKey = `${selectedYear}-${monthStr}-${dayStr}`;
        const isSun = isSunday(selectedYear, selectedMonth, day);

        if (isSun) return 'H';

        const record = attendanceDb[dateKey]?.[student.id];
        const status = record?.status || 'P';
        if (status === 'P') presentDays++;
        if (status === 'A') absentDays++;
        return status;
      });

      const percentage = workingDaysCount > 0 ? Math.round((presentDays / workingDaysCount) * 100) : 0;

      return [
        student.rollNo,
        student.grNo,
        `"${student.name}"`,
        student.gender === 'boy' ? 'Boy' : 'Girl',
        ...dayStatuses,
        workingDaysCount,
        presentDays,
        absentDays,
        `${percentage}%`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hajari_Patrak_Std7_${monthObj.en}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle cell on click (P -> A -> L -> P)
  const handleCellClick = (day: number, studentId: string) => {
    const isSun = isSunday(selectedYear, selectedMonth, day);
    if (isSun) return; // Sunday is holiday

    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(selectedMonth).padStart(2, '0');
    const dateKey = `${selectedYear}-${monthStr}-${dayStr}`;

    const currentRecord = attendanceDb[dateKey]?.[studentId];
    const currentStatus = currentRecord?.status || 'P';

    let nextStatus: 'P' | 'A' | 'L' = 'P';
    if (currentStatus === 'P') nextStatus = 'A';
    else if (currentStatus === 'A') nextStatus = 'L';
    else nextStatus = 'P';

    onUpdateDayStatus(dateKey, studentId, nextStatus);
  };

  return (
    <div className="space-y-4">
      {/* Month & Year Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="અગાઉનો મહિનો"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="font-bold text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {GUJARATI_MONTHS.map(m => (
                <option key={m.value} value={m.value}>
                  {m.gu} ({m.en})
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="font-bold text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value={2025}>૨૦૨૫ (2025)</option>
              <option value={2026}>૨૦૨૬ (2026)</option>
              <option value={2027}>૨૦૨૭ (2027)</option>
            </select>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="આગામી મહિનો"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata summary & action buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded-md">
            કુલ શાળા દિવસો: <strong className="text-slate-800 font-mono-numbers">{toGujaratiDigits(workingDaysCount)}</strong>
          </span>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel / CSV</span>
          </button>

          <button
            onClick={onOpenPrint}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>પ્રિન્ટ હાજરી પત્રક</span>
          </button>
        </div>

      </div>

      {/* Guide Note */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-50/70 border border-amber-200/80 px-3.5 py-2 rounded-lg">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>ઝડપી સુધારો:</strong> કોઈ પણ તારીખના ખાના પર ક્લિક કરવાથી સ્થિતિ બદલાશે: 
          <span className="font-semibold text-emerald-700 mx-1">P (હાજર)</span> → 
          <span className="font-semibold text-rose-700 mx-1">A (ગેરહાજર)</span> → 
          <span className="font-semibold text-amber-700 mx-1">L (રજા)</span>. રવિવાર લાલ રંગથી દર્શાવેલ છે.
        </span>
      </div>

      {/* Master Matrix Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[72vh]">
          <table className="w-full text-center border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100 z-10 border-b border-slate-300 shadow-2xs">
              
              {/* Row 1: Day Numbers 1..31 */}
              <tr>
                <th className="py-2 px-1 text-center w-8 border-r border-slate-200 bg-slate-100 font-bold sticky left-0 z-20">
                  રોલ
                </th>
                <th className="py-2 px-2 text-center w-12 border-r border-slate-200 bg-slate-100 font-bold sticky left-8 z-20">
                  ફોટો
                </th>
                <th className="py-2 px-3 text-left w-52 border-r border-slate-200 bg-slate-100 font-bold sticky left-20 z-20">
                  વિદ્યાર્થીનું નામ
                </th>
                
                {daysArray.map(day => {
                  const isSun = isSunday(selectedYear, selectedMonth, day);
                  return (
                    <th
                      key={`day-${day}`}
                      className={`py-1.5 px-1 min-w-[28px] max-w-[32px] border-r border-slate-200 font-mono-numbers font-bold ${
                        isSun ? 'bg-rose-100 text-rose-800' : 'text-slate-800'
                      }`}
                    >
                      {toGujaratiDigits(day)}
                    </th>
                  );
                })}

                <th className="py-2 px-2 text-center w-12 border-r border-slate-200 bg-slate-100 font-bold">
                  હાજર
                </th>
                <th className="py-2 px-2 text-center w-12 border-r border-slate-200 bg-slate-100 font-bold">
                  ગેરહાજર
                </th>
                <th className="py-2 px-2 text-center w-14 bg-slate-100 font-bold">
                  ટકા (%)
                </th>
              </tr>

              {/* Row 2: Day Names (રવિ, સોમ...) */}
              <tr className="border-b border-slate-300 text-[10px] text-slate-500 bg-slate-50">
                <th className="py-1 border-r border-slate-200 sticky left-0 z-20 bg-slate-50"></th>
                <th className="py-1 border-r border-slate-200 sticky left-8 z-20 bg-slate-50"></th>
                <th className="py-1 text-left px-3 border-r border-slate-200 sticky left-20 z-20 bg-slate-50">
                  વાર / Days
                </th>

                {daysArray.map(day => {
                  const isSun = isSunday(selectedYear, selectedMonth, day);
                  return (
                    <th
                      key={`name-${day}`}
                      className={`py-1 border-r border-slate-200 ${
                        isSun ? 'bg-rose-50 text-rose-600 font-bold' : ''
                      }`}
                    >
                      {getDayOfWeekName(selectedYear, selectedMonth, day, true).slice(0, 3)}
                    </th>
                  );
                })}

                <th className="py-1 border-r border-slate-200">દિવસ</th>
                <th className="py-1 border-r border-slate-200">દિવસ</th>
                <th className="py-1">%</th>
              </tr>

            </thead>

            <tbody className="divide-y divide-slate-200 text-xs">
              {students.map((student) => {
                let presentDays = 0;
                let absentDays = 0;
                let leaveDays = 0;

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Roll No */}
                    <td className="py-1 px-1 font-mono-numbers font-bold text-slate-700 border-r border-slate-200 sticky left-0 bg-white z-10">
                      {toGujaratiDigits(student.rollNo)}
                    </td>

                    {/* Student Photo */}
                    <td className="py-1 px-1 border-r border-slate-200 sticky left-8 bg-white z-10 text-center">
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-md object-cover border border-slate-200 mx-auto"
                      />
                    </td>

                    {/* Student Name */}
                    <td className="py-1.5 px-3 text-left border-r border-slate-200 sticky left-20 bg-white z-10 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 truncate max-w-[190px]">
                        {student.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        GR: {student.grNo} · {student.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
                      </div>
                    </td>

                    {/* 1..31 Status cells */}
                    {daysArray.map(day => {
                      const dayStr = String(day).padStart(2, '0');
                      const monthStr = String(selectedMonth).padStart(2, '0');
                      const dateKey = `${selectedYear}-${monthStr}-${dayStr}`;
                      const isSun = isSunday(selectedYear, selectedMonth, day);

                      if (isSun) {
                        return (
                          <td
                            key={`cell-${student.id}-${day}`}
                            className="py-1 px-0.5 border-r border-slate-200 bg-rose-50/70 text-rose-600 font-bold text-[10px] select-none"
                          >
                            ર
                          </td>
                        );
                      }

                      const record = attendanceDb[dateKey]?.[student.id];
                      const status = record?.status || 'P';

                      if (status === 'P') presentDays++;
                      else if (status === 'A') absentDays++;
                      else if (status === 'L') leaveDays++;

                      let statusClass = 'text-emerald-700 hover:bg-emerald-100 font-bold';
                      let statusChar = 'P';

                      if (status === 'A') {
                        statusClass = 'text-rose-700 bg-rose-100 font-extrabold hover:bg-rose-200';
                        statusChar = 'A';
                      } else if (status === 'L') {
                        statusClass = 'text-amber-700 bg-amber-100 font-bold hover:bg-amber-200';
                        statusChar = 'L';
                      }

                      return (
                        <td
                          key={`cell-${student.id}-${day}`}
                          onClick={() => handleCellClick(day, student.id)}
                          className={`py-1 px-0.5 border-r border-slate-200 cursor-pointer select-none text-[11px] font-mono-numbers transition-colors ${statusClass}`}
                          title={`${day} તારીખે ${student.name}: ${status === 'P' ? 'હાજર' : status === 'A' ? 'ગેરહાજર' : 'રજા'}`}
                        >
                          {statusChar}
                        </td>
                      );
                    })}

                    {/* Present Days Total */}
                    <td className="py-1 px-1 font-mono-numbers font-bold text-emerald-800 bg-emerald-50/30 border-r border-slate-200">
                      {toGujaratiDigits(presentDays)}
                    </td>

                    {/* Absent Days Total */}
                    <td className="py-1 px-1 font-mono-numbers font-bold text-rose-800 bg-rose-50/30 border-r border-slate-200">
                      {toGujaratiDigits(absentDays)}
                    </td>

                    {/* Percentage */}
                    <td className="py-1 px-1 font-mono-numbers font-bold text-slate-800 bg-slate-50">
                      {toGujaratiDigits(
                        workingDaysCount > 0 ? Math.round((presentDays / workingDaysCount) * 100) : 0
                      )}%
                    </td>

                  </tr>
                );
              })}

              {/* Bottom Totals Row: Daily Present Count */}
              <tr className="bg-slate-100/90 font-bold text-[11px] border-t-2 border-slate-300">
                <td colSpan={3} className="py-2 px-3 text-left border-r border-slate-300 sticky left-0 bg-slate-100 z-10 text-slate-800">
                  દૈનિક કુલ હાજરી (Total Present)
                </td>

                {daysArray.map(day => {
                  const dayStr = String(day).padStart(2, '0');
                  const monthStr = String(selectedMonth).padStart(2, '0');
                  const dateKey = `${selectedYear}-${monthStr}-${dayStr}`;
                  const isSun = isSunday(selectedYear, selectedMonth, day);

                  if (isSun) {
                    return (
                      <td key={`tot-${day}`} className="py-1 border-r border-slate-200 bg-rose-100 text-rose-700 text-[10px]">
                        રજા
                      </td>
                    );
                  }

                  let dayPresent = 0;
                  students.forEach(s => {
                    const status = attendanceDb[dateKey]?.[s.id]?.status || 'P';
                    if (status === 'P') dayPresent++;
                  });

                  return (
                    <td key={`tot-${day}`} className="py-1 border-r border-slate-200 font-mono-numbers text-slate-900">
                      {toGujaratiDigits(dayPresent)}
                    </td>
                  );
                })}

                <td colSpan={3} className="py-1 text-center bg-slate-100">
                  -
                </td>
              </tr>

              {/* Bottom Row: Daily Attendance % */}
              <tr className="bg-slate-50 font-bold text-[10px] text-slate-600 border-t border-slate-200">
                <td colSpan={3} className="py-1.5 px-3 text-left border-r border-slate-300 sticky left-0 bg-slate-50 z-10">
                  દૈનિક હાજરી ટકાવારી (%)
                </td>

                {daysArray.map(day => {
                  const dayStr = String(day).padStart(2, '0');
                  const monthStr = String(selectedMonth).padStart(2, '0');
                  const dateKey = `${selectedYear}-${monthStr}-${dayStr}`;
                  const isSun = isSunday(selectedYear, selectedMonth, day);

                  if (isSun) {
                    return <td key={`pct-${day}`} className="py-1 border-r border-slate-200 bg-rose-50">-</td>;
                  }

                  let dayPresent = 0;
                  students.forEach(s => {
                    const status = attendanceDb[dateKey]?.[s.id]?.status || 'P';
                    if (status === 'P') dayPresent++;
                  });

                  const pct = students.length > 0 ? Math.round((dayPresent / students.length) * 100) : 0;

                  return (
                    <td key={`pct-${day}`} className="py-1 border-r border-slate-200 font-mono-numbers">
                      {toGujaratiDigits(pct)}
                    </td>
                  );
                })}

                <td colSpan={3} className="py-1 text-center">
                  -
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Verification signatures footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
          <div className="text-center sm:text-left">
            <div>વર્ગ શિક્ષકની સહી: <span className="font-semibold text-slate-900">{schoolConfig.classTeacher}</span></div>
            <div className="text-[11px] text-slate-400">તારીખ: {toGujaratiDigits(daysInMonth)}/{toGujaratiDigits(selectedMonth)}/{toGujaratiDigits(selectedYear)}</div>
          </div>

          <div className="text-center sm:text-right">
            <div>આચાર્યશ્રીની સહી: <span className="font-semibold text-slate-900">{schoolConfig.principalName}</span></div>
            <div className="text-[11px] text-slate-400">{schoolConfig.schoolName}</div>
          </div>
        </div>

      </div>
    </div>
  );
};
