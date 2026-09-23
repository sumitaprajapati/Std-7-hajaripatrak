import React, { useState } from 'react';
import { Student, AttendanceDatabase, SchoolConfig } from '../types/student';
import { GUJARATI_MONTHS, toGujaratiDigits, getDaysInMonth, isSunday, getDayOfWeekName } from '../utils/gujarati';
import { Utensils, Printer } from 'lucide-react';

interface MdmReportProps {
  students: Student[];
  attendanceDb: AttendanceDatabase;
  schoolConfig: SchoolConfig;
}

export const MdmReport: React.FC<MdmReportProps> = ({
  students,
  attendanceDb,
  schoolConfig,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September
  const [selectedYear] = useState<number>(2026);

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthObj = GUJARATI_MONTHS.find(m => m.value === selectedMonth) || GUJARATI_MONTHS[8];

  // Daily statistics calculation
  const dailyData = daysArray.map(day => {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(selectedMonth).padStart(2, '0');
    const dateKey = `${selectedYear}-${monthStr}-${dayStr}`;
    const isSun = isSunday(selectedYear, selectedMonth, day);

    if (isSun) {
      return { day, isSun: true, boysPresent: 0, girlsPresent: 0, mdmBoys: 0, mdmGirls: 0, totalMdm: 0 };
    }

    let boysPresent = 0;
    let girlsPresent = 0;
    let mdmBoys = 0;
    let mdmGirls = 0;

    students.forEach(student => {
      const record = attendanceDb[dateKey]?.[student.id];
      const isPresent = (record?.status || 'P') === 'P';
      const tookMdm = record?.tookMdm ?? (isPresent && student.takesMdm);

      if (isPresent) {
        if (student.gender === 'boy') boysPresent++;
        else girlsPresent++;
      }

      if (tookMdm) {
        if (student.gender === 'boy') mdmBoys++;
        else mdmGirls++;
      }
    });

    return {
      day,
      isSun: false,
      boysPresent,
      girlsPresent,
      mdmBoys,
      mdmGirls,
      totalMdm: mdmBoys + mdmGirls,
    };
  });

  const totalWorkingDays = dailyData.filter(d => !d.isSun).length;
  const totalBeneficiaries = dailyData.reduce((acc, d) => acc + d.totalMdm, 0);
  const averageDailyMdm = totalWorkingDays > 0 ? Math.round(totalBeneficiaries / totalWorkingDays) : 0;

  // Mid-Day Meal ration standard norms for Upper Primary (Std 6-8):
  // 150 grams wheat/rice per child per day, 30g pulses, 75g vegetables, 7.5g oil/fat
  const totalFoodgrainsKg = Math.round((totalBeneficiaries * 0.15) * 10) / 10;
  const totalPulsesKg = Math.round((totalBeneficiaries * 0.03) * 10) / 10;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-600" />
            <span>મધ્યાહ્ન ભોજન (MDM) માસિક રિપોર્ટ</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {schoolConfig.schoolName} · ધોરણ ૭ · માસ: {monthObj.gu} {toGujaratiDigits(selectedYear)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-amber-500"
          >
            {GUJARATI_MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.gu} ({m.en})</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>પ્રિન્ટ MDM પત્રક</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-800">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">કુલ ભોજન દિવસો</div>
          <div className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">
            {toGujaratiDigits(totalWorkingDays)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">કાર્યકારી દિવસો</div>
        </div>

        <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-200 shadow-xs">
          <div className="text-xs text-orange-800 font-medium">કુલ લાભાર્થી સંખ્યા</div>
          <div className="text-2xl font-bold font-mono-numbers text-orange-900 mt-1">
            {toGujaratiDigits(totalBeneficiaries)}
          </div>
          <div className="text-[11px] text-orange-700 mt-0.5">માસિક સંચયી (Cumulative)</div>
        </div>

        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 shadow-xs">
          <div className="text-xs text-emerald-800 font-medium">દૈનિક સરેરાશ લાભાર્થી</div>
          <div className="text-2xl font-bold font-mono-numbers text-emerald-900 mt-1">
            {toGujaratiDigits(averageDailyMdm)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">વિદ્યાર્થી/દિવસ</div>
        </div>

        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 shadow-xs">
          <div className="text-xs text-blue-800 font-medium">અનાજ વપરાશ (અંદાજિત)</div>
          <div className="text-2xl font-bold font-mono-numbers text-blue-900 mt-1">
            {toGujaratiDigits(totalFoodgrainsKg)} <span className="text-xs font-normal">કિ.ગ્રા.</span>
          </div>
          <div className="text-[11px] text-blue-700 mt-0.5">કઠોળ: {toGujaratiDigits(totalPulsesKg)} કિ.ગ્રા.</div>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-bold text-sm text-slate-900">
            દૈનિક મધ્યાહ્ન ભોજન વિગતવાર રજિસ્ટર (Daily MDM Breakdown)
          </h3>
        </div>

        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-2.5 px-3 text-center w-16">તારીખ</th>
                <th className="py-2.5 px-3 w-28">વાર</th>
                <th className="py-2.5 px-3 text-center">હાજર કુમાર</th>
                <th className="py-2.5 px-3 text-center">હાજર કન્યા</th>
                <th className="py-2.5 px-3 text-center font-bold">કુલ હાજર</th>
                <th className="py-2.5 px-3 text-center text-orange-700">MDM કુમાર</th>
                <th className="py-2.5 px-3 text-center text-orange-700">MDM કન્યા</th>
                <th className="py-2.5 px-3 text-center font-bold text-orange-900 bg-orange-50/50">કુલ MDM લાભાર્થી</th>
                <th className="py-2.5 px-3">મેનુ / વિગત</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono-numbers">
              {dailyData.map((row) => {
                if (row.isSun) {
                  return (
                    <tr key={row.day} className="bg-rose-50/40 text-rose-700">
                      <td className="py-2 px-3 text-center font-bold">{toGujaratiDigits(row.day)}</td>
                      <td className="py-2 px-3 font-sans">રવિવાર</td>
                      <td colSpan={7} className="py-2 px-3 font-sans italic text-rose-600">
                        શાળા રજા
                      </td>
                    </tr>
                  );
                }

                const dayName = getDayOfWeekName(selectedYear, selectedMonth, row.day, true);
                const defaultMenus: Record<string, string> = {
                  'સોમ': 'શાક-રોટલી, દાળ-ભાત',
                  'મંગળ': 'થેપલા-સૂકીભાજી',
                  'બુધ': 'વેજ પુલાવ, કઢી',
                  'ગુરુ': 'દાળ-ઢોકળી, મુઠિયા',
                  'શુક્ર': 'સુખડી, ચણાચાટ, પુલાવ',
                  'શનિ': 'ખીચડી-શાક',
                };
                const menu = defaultMenus[dayName] || 'ગરમ પૌષ્ટિક આહાર';

                return (
                  <tr key={row.day} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 text-center font-bold text-slate-800">
                      {toGujaratiDigits(row.day)}
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-600">
                      {dayName}વાર
                    </td>
                    <td className="py-2 px-3 text-center text-slate-700">
                      {toGujaratiDigits(row.boysPresent)}
                    </td>
                    <td className="py-2 px-3 text-center text-slate-700">
                      {toGujaratiDigits(row.girlsPresent)}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-slate-900">
                      {toGujaratiDigits(row.boysPresent + row.girlsPresent)}
                    </td>
                    <td className="py-2 px-3 text-center text-orange-700">
                      {toGujaratiDigits(row.mdmBoys)}
                    </td>
                    <td className="py-2 px-3 text-center text-orange-700">
                      {toGujaratiDigits(row.mdmGirls)}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-orange-800 bg-orange-50/40">
                      {toGujaratiDigits(row.totalMdm)}
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">
                      {menu}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
