import React, { useState } from 'react';
import { Student, AttendanceDatabase, SchoolConfig } from '../types/student';
import { GUJARATI_MONTHS, toGujaratiDigits, getDaysInMonth, isSunday } from '../utils/gujarati';
import { X, Printer } from 'lucide-react';

interface PrintRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  attendanceDb: AttendanceDatabase;
  schoolConfig: SchoolConfig;
}

export const PrintRegisterModal: React.FC<PrintRegisterModalProps> = ({
  isOpen,
  onClose,
  students,
  attendanceDb,
  schoolConfig,
}) => {
  const [printMode, setPrintMode] = useState<'register' | 'idcards'>('register');
  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  if (!isOpen) return null;

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthObj = GUJARATI_MONTHS.find(m => m.value === selectedMonth) || GUJARATI_MONTHS[8];

  let workingDaysCount = 0;
  daysArray.forEach(d => {
    if (!isSunday(selectedYear, selectedMonth, d)) workingDaysCount++;
  });

  const boysCount = students.filter(s => s.gender === 'boy').length;
  const girlsCount = students.filter(s => s.gender === 'girl').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full p-4 sm:p-6 shadow-2xl my-4 relative max-h-[92vh] flex flex-col">
        
        {/* Top Controls Bar (Hidden during print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 no-print">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              પત્રક પ્રિન્ટ અને PDF ડાઉનલોડ પ્રિવ્યૂ
            </h2>
            <p className="text-xs text-slate-500">
              {schoolConfig.schoolName} · ધોરણ ૭ · {monthObj.gu} {toGujaratiDigits(selectedYear)}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setPrintMode('register')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  printMode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                માસિક હાજરી પત્રક
              </button>
              <button
                onClick={() => setPrintMode('idcards')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  printMode === 'idcards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                સચિત્ર ID કાર્ડ્સ
              </button>
            </div>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold"
            >
              {GUJARATI_MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.gu}</option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>હમણાં પ્રિન્ટ કરો (Print / Save PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6 bg-slate-100/50 rounded-xl my-3">
          
          {printMode === 'register' ? (
            /* OFFICIAL GUJARAT HAJARI PATRAK FORMAT */
            <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-xs text-black font-serif print:border-none print:shadow-none print:p-0">
              
              {/* Header */}
              <div className="text-center border-b-2 border-black pb-3 mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  ગુજરાત સરકાર - પ્રાથમિક શિક્ષણ નિયામકની કચેરી
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
                  {schoolConfig.schoolName}
                </h1>
                <div className="text-xs text-slate-700 font-sans mt-0.5">
                  તા. {schoolConfig.taluka}, જી. {schoolConfig.district} · શાળા ડાયસ કોડ: {schoolConfig.diseCode}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-xs font-semibold font-sans">
                  <span>વર્ગ: {schoolConfig.standard} ({schoolConfig.division})</span>
                  <span>માસ: {monthObj.gu} - {toGujaratiDigits(selectedYear)}</span>
                  <span>શૈક્ષણિક વર્ષ: {schoolConfig.academicYear}</span>
                  <span>કુલ કામકાજના દિવસો: {toGujaratiDigits(workingDaysCount)}</span>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse text-[10px] border border-black">
                  <thead>
                    <tr className="bg-slate-100 border-b border-black font-bold">
                      <th className="border border-black py-1 px-1 w-6">રોલ</th>
                      <th className="border border-black py-1 px-1 w-8">ફોટો</th>
                      <th className="border border-black py-1 px-2 text-left w-44">વિદ્યાર્થીનું નામ</th>
                      <th className="border border-black py-1 px-1 w-12">GR નં.</th>
                      <th className="border border-black py-1 px-1 w-10">જાતિ</th>
                      
                      {daysArray.map(day => {
                        const isSun = isSunday(selectedYear, selectedMonth, day);
                        return (
                          <th
                            key={`pday-${day}`}
                            className={`border border-black py-1 px-0.5 ${isSun ? 'bg-slate-200' : ''}`}
                          >
                            {toGujaratiDigits(day)}
                          </th>
                        );
                      })}

                      <th className="border border-black py-1 px-1 w-9">હાજર</th>
                      <th className="border border-black py-1 px-1 w-9">ગેર.</th>
                      <th className="border border-black py-1 px-1 w-10">ટકા %</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => {
                      let presentDays = 0;
                      let absentDays = 0;

                      return (
                        <tr key={`print-row-${student.id}`} className="border-b border-black/60">
                          <td className="border border-black py-0.5 px-1 font-bold">
                            {toGujaratiDigits(student.rollNo)}
                          </td>
                          <td className="border border-black py-0.5 px-0.5 text-center">
                            <img
                              src={student.photoUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-5 h-5 rounded-xs object-cover mx-auto"
                            />
                          </td>
                          <td className="border border-black py-0.5 px-2 text-left truncate font-sans font-medium">
                            {student.name}
                          </td>
                          <td className="border border-black py-0.5 px-1">
                            {student.grNo}
                          </td>
                          <td className="border border-black py-0.5 px-1 text-center font-sans">
                            {student.gender === 'boy' ? 'કુ' : 'ક'}
                          </td>

                          {daysArray.map(day => {
                            const dayStr = String(day).padStart(2, '0');
                            const monthStr = String(selectedMonth).padStart(2, '0');
                            const dateKey = `${selectedYear}-${monthStr}-${dayStr}`;
                            const isSun = isSunday(selectedYear, selectedMonth, day);

                            if (isSun) {
                              return (
                                <td key={`pcell-${student.id}-${day}`} className="border border-black bg-slate-100 font-bold">
                                  ર
                                </td>
                              );
                            }

                            const record = attendanceDb[dateKey]?.[student.id];
                            const status = record?.status || 'P';
                            if (status === 'P') presentDays++;
                            if (status === 'A') absentDays++;

                            return (
                              <td
                                key={`pcell-${student.id}-${day}`}
                                className={`border border-black py-0.5 px-0.5 ${
                                  status === 'A' ? 'font-bold bg-slate-200' : ''
                                }`}
                              >
                                {status === 'P' ? '•' : status === 'A' ? 'A' : 'L'}
                              </td>
                            );
                          })}

                          <td className="border border-black py-0.5 px-1 font-bold">
                            {toGujaratiDigits(presentDays)}
                          </td>
                          <td className="border border-black py-0.5 px-1">
                            {toGujaratiDigits(absentDays)}
                          </td>
                          <td className="border border-black py-0.5 px-1 font-bold">
                            {toGujaratiDigits(
                              workingDaysCount > 0 ? Math.round((presentDays / workingDaysCount) * 100) : 0
                            )}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Official Signatures & Summary Footer */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-4 border-t-2 border-black text-xs font-sans">
                <div>
                  <div className="font-bold mb-1">પટ પર સંખ્યા વિગત:</div>
                  <div>કુમાર: {toGujaratiDigits(boysCount)} · કન્યા: {toGujaratiDigits(girlsCount)}</div>
                  <div className="font-semibold">કુલ વિદ્યાર્થી: {toGujaratiDigits(students.length)}</div>
                </div>

                <div className="text-center pt-8">
                  <div className="border-t border-dotted border-black pt-1">
                    વર્ગ શિક્ષકની સહી<br />
                    <strong>({schoolConfig.classTeacher})</strong>
                  </div>
                </div>

                <div className="text-right pt-8">
                  <div className="border-t border-dotted border-black pt-1">
                    આચાર્યશ્રીની સહી અને સિક્કો<br />
                    <strong>({schoolConfig.principalName})</strong>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* STUDENT ID PHOTO CARDS SHEET */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg">
              {students.map((student) => (
                <div
                  key={`id-${student.id}`}
                  className="border-2 border-slate-300 rounded-xl p-3.5 bg-white text-xs flex flex-col justify-between"
                >
                  <div className="border-b border-slate-200 pb-2 mb-2 text-center">
                    <div className="font-bold text-slate-900 text-sm">{schoolConfig.schoolName}</div>
                    <div className="text-[10px] text-slate-500">ઓળખપત્ર (વિદ્યાર્થી ID કાર્ડ) · ધોરણ ૭</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-300"
                    />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="font-bold text-slate-900 truncate">{student.name}</div>
                      <div className="text-[11px] text-slate-600">રોલ: {toGujaratiDigits(student.rollNo)} · GR: {student.grNo}</div>
                      <div className="text-[11px] text-slate-500">પિતા: {student.fatherName}</div>
                      <div className="text-[10px] text-slate-400">જન્મ: {student.dob} · મો: {student.phone}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>વર્ગ: ૭ (અ)</span>
                    <span>શિક્ષક: {schoolConfig.classTeacher}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
