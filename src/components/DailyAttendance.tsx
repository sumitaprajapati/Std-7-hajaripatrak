import React, { useState } from 'react';
import { Student, DayAttendance, SchoolConfig } from '../types/student';
import { formatGujaratiDate, toGujaratiDigits, generateAbsenceWhatsAppUrl } from '../utils/gujarati';
import { Check, X, Clock, ChevronLeft, ChevronRight, MessageSquare, Utensils, CheckCheck, UserPlus, Trash2, Edit3 } from 'lucide-react';

interface DailyAttendanceProps {
  students: Student[];
  currentDate: string;
  onDateChange: (newDate: string) => void;
  attendanceData: Record<string, DayAttendance>;
  onUpdateAttendance: (studentId: string, updates: Partial<DayAttendance>) => void;
  onMarkAllPresent: () => void;
  onSelectStudent: (student: Student) => void;
  onAddNewStudent: () => void;
  onDeleteStudent: (studentId: string) => void;
  schoolConfig: SchoolConfig;
}

export const DailyAttendance: React.FC<DailyAttendanceProps> = ({
  students,
  currentDate,
  onDateChange,
  attendanceData,
  onUpdateAttendance,
  onMarkAllPresent,
  onSelectStudent,
  onAddNewStudent,
  onDeleteStudent,
  schoolConfig,
}) => {
  const [filterGender, setFilterGender] = useState<'all' | 'boy' | 'girl'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'P' | 'A' | 'L'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Date increment/decrement
  const shiftDate = (offsetDays: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + offsetDays);
    const newDateStr = d.toISOString().split('T')[0];
    onDateChange(newDateStr);
  };

  // Stats calculation
  const totalStudents = students.length;
  const boysCount = students.filter(s => s.gender === 'boy').length;
  const girlsCount = students.filter(s => s.gender === 'girl').length;

  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;
  let mdmCount = 0;

  students.forEach(student => {
    const record = attendanceData[student.id];
    const status = record?.status || 'P'; // default present
    if (status === 'P') presentCount++;
    else if (status === 'A') absentCount++;
    else if (status === 'L') leaveCount++;

    const tookMdm = record?.tookMdm ?? (status === 'P' && student.takesMdm);
    if (tookMdm) mdmCount++;
  });

  const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  // Filtered student list
  const filteredStudents = students.filter(student => {
    if (filterGender !== 'all' && student.gender !== filterGender) return false;
    
    const record = attendanceData[student.id];
    const status = record?.status || 'P';
    if (filterStatus !== 'all' && status !== filterStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = student.name.toLowerCase().includes(q);
      const matchGr = student.grNo.includes(q);
      const matchRoll = String(student.rollNo).includes(q);
      if (!matchName && !matchGr && !matchRoll) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Date Header & Quick Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          
          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => shiftDate(-1)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="અગાઉનો દિવસ"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                હાજરી તારીખ
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="hidden sm:inline text-sm font-medium text-slate-600">
                  ({formatGujaratiDate(currentDate)})
                </span>
              </div>
            </div>

            <button
              onClick={() => shiftDate(1)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="આગામી દિવસ"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onDateChange(new Date().toISOString().split('T')[0])}
              className="ml-2 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              આજની તારીખ
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onMarkAllPresent}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>બધા હાજર માર્ક કરો</span>
            </button>

            <button
              onClick={onAddNewStudent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ નવો વિદ્યાર્થી ઉમેરો</span>
            </button>
          </div>
        </div>

        {/* Real-time stats display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 text-slate-800">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 font-medium">કુલ વિદ્યાર્થી</div>
            <div className="text-xl font-bold font-mono-numbers text-slate-900">
              {toGujaratiDigits(totalStudents)} <span className="text-xs font-normal text-slate-400">({totalStudents})</span>
            </div>
            <div className="text-[11px] text-slate-400">
              કુમાર: {toGujaratiDigits(boysCount)} · કન્યા: {toGujaratiDigits(girlsCount)}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
            <div className="text-xs text-emerald-700 font-medium">હાજર સંખ્યા</div>
            <div className="text-xl font-bold font-mono-numbers text-emerald-800">
              {toGujaratiDigits(presentCount)}
            </div>
            <div className="text-[11px] text-emerald-600">
              હાજરી {toGujaratiDigits(attendancePercentage)}%
            </div>
          </div>

          <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-100">
            <div className="text-xs text-rose-700 font-medium">ગેરહાજર સંખ્યા</div>
            <div className="text-xl font-bold font-mono-numbers text-rose-800">
              {toGujaratiDigits(absentCount)}
            </div>
            <div className="text-[11px] text-rose-600">
              {absentCount > 0 ? 'વાલીને જાણ કરો' : 'બધા હાજર છે'}
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-100">
            <div className="text-xs text-amber-700 font-medium">રજા (Leave)</div>
            <div className="text-xl font-bold font-mono-numbers text-amber-800">
              {toGujaratiDigits(leaveCount)}
            </div>
            <div className="text-[11px] text-amber-600">
              મંજૂર કરેલ રજા
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100">
            <div className="text-xs text-blue-700 font-medium">હાજરી ટકાવારી</div>
            <div className="text-xl font-bold font-mono-numbers text-blue-800">
              {toGujaratiDigits(attendancePercentage)}%
            </div>
            <div className="text-[11px] text-blue-600">
              લક્ષ્યાંક: ૯૦%+
            </div>
          </div>

          <div className="p-3 bg-orange-50/60 rounded-lg border border-orange-100">
            <div className="text-xs text-orange-700 font-medium">મધ્યાહ્ન ભોજન (MDM)</div>
            <div className="text-xl font-bold font-mono-numbers text-orange-800">
              {toGujaratiDigits(mdmCount)}
            </div>
            <div className="text-[11px] text-orange-600">
              વિદ્યાર્થી લાભાર્થી
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setFilterGender('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterGender === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              બધા ({totalStudents})
            </button>
            <button
              onClick={() => setFilterGender('boy')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterGender === 'boy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              કુમાર ({boysCount})
            </button>
            <button
              onClick={() => setFilterGender('girl')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterGender === 'girl' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              કન્યા ({girlsCount})
            </button>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              બધી સ્થિતિ
            </button>
            <button
              onClick={() => setFilterStatus('P')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                filterStatus === 'P' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              હાજર ({presentCount})
            </button>
            <button
              onClick={() => setFilterStatus('A')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                filterStatus === 'A' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              ગેરહાજર ({absentCount})
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="નામ, રોલ નં. અથવા GR નં. શોધો..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Attendance Register Table & Cards */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-3 w-14 text-center">રોલ નં.</th>
                <th className="py-3 px-2 w-16 text-center">ફોટો</th>
                <th className="py-3 px-3">વિદ્યાર્થીનું પૂરું નામ</th>
                <th className="py-3 px-3 w-24">જી.આર. નં.</th>
                <th className="py-3 px-3 w-20 text-center">જાતિ</th>
                <th className="py-3 px-3 w-56 text-center">હાજરી સ્થિતિ (P / A / L)</th>
                <th className="py-3 px-3 w-24 text-center">MDM ભોજન</th>
                <th className="py-3 px-3 w-40">નોંધ / વાલી સૂચના</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map((student) => {
                const record = attendanceData[student.id];
                const currentStatus: 'P' | 'A' | 'L' | 'H' = record?.status || 'P';
                const tookMdm = record?.tookMdm ?? (currentStatus === 'P' && student.takesMdm);
                const remark = record?.remark || '';

                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      currentStatus === 'A' ? 'bg-rose-50/30' : currentStatus === 'L' ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Roll No */}
                    <td className="py-3 px-3 text-center font-mono-numbers font-bold text-slate-700">
                      {toGujaratiDigits(student.rollNo)}
                    </td>

                    {/* Student Photo */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="relative group block mx-auto focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                        title="વિદ્યાર્થી પ્રોફાઇલ જુઓ"
                      >
                        <img
                          src={student.photoUrl}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-slate-900 text-[9px] text-white px-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          જુઓ
                        </span>
                      </button>
                    </td>

                    {/* Student Name and Parent details */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        પિતા: {student.fatherName}
                      </div>
                    </td>

                    {/* GR No */}
                    <td className="py-3 px-3 font-mono-numbers text-slate-600">
                      {student.grNo}
                    </td>

                    {/* Gender */}
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[11px] font-medium ${
                        student.gender === 'boy' ? 'text-blue-700' : 'text-rose-700'
                      }`}>
                        {student.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
                      </span>
                    </td>

                    {/* Attendance Status Action Group */}
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Present Button */}
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateAttendance(student.id, {
                              status: 'P',
                              tookMdm: student.takesMdm,
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 ${
                            currentStatus === 'P'
                              ? 'bg-emerald-600 text-white shadow-xs scale-102'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>P · હાજર</span>
                        </button>

                        {/* Absent Button */}
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateAttendance(student.id, {
                              status: 'A',
                              tookMdm: false,
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 ${
                            currentStatus === 'A'
                              ? 'bg-rose-600 text-white shadow-xs scale-102'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>A · ગેરહાજર</span>
                        </button>

                        {/* Leave Button */}
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateAttendance(student.id, {
                              status: 'L',
                              tookMdm: false,
                            });
                          }}
                          className={`px-2.5 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 ${
                            currentStatus === 'L'
                              ? 'bg-amber-600 text-white shadow-xs scale-102'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>L · રજા</span>
                        </button>
                      </div>
                    </td>

                    {/* MDM Toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateAttendance(student.id, { tookMdm: !tookMdm });
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 mx-auto ${
                          tookMdm
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                        title={tookMdm ? 'મધ્યાહ્ન ભોજન લીધું' : 'મધ્યાહ્ન ભોજન નથી લીધું'}
                      >
                        <Utensils className="w-3 h-3" />
                        <span>{tookMdm ? 'હા' : 'ના'}</span>
                      </button>
                    </td>

                    {/* Remarks & WhatsApp alert */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={currentStatus === 'A' ? 'ગેરહાજરીનું કારણ...' : 'નોંધ...'}
                          value={remark}
                          onChange={(e) => {
                            onUpdateAttendance(student.id, { remark: e.target.value });
                          }}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />

                        <div className="flex items-center gap-1 shrink-0">
                          {currentStatus === 'A' && (
                            <a
                              href={generateAbsenceWhatsAppUrl(
                                student.phone,
                                student.name,
                                schoolConfig.schoolName,
                                formatGujaratiDate(currentDate),
                                schoolConfig.classTeacher
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                              title="વાલીને વોટ્સએપ મેસેજ મોકલો"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => onSelectStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 rounded-md transition-colors"
                            title="વિગત સુધારો"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`શું તમે ખરેખર "${student.name}" (રોલ નં. ${student.rollNo}) નો રેકોર્ડ રદ કરવા (Delete) માંગો છો?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-md transition-colors"
                            title="વિદ્યાર્થી કાઢી નાખો (Delete)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 bg-slate-50/50">
                    <div className="max-w-md mx-auto space-y-3">
                      <p className="font-semibold text-slate-700">
                        {students.length === 0
                          ? 'વર્ગ ૭ માં હાલ કોઈ વિદ્યાર્થી નોંધાયેલ નથી.'
                          : 'શોધ મુજબ કોઈ વિદ્યાર્થી મળ્યો નથી.'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {students.length === 0
                          ? 'નવા વિદ્યાર્થીઓ ઉમેરવા માટે નીચેના બટન પર ક્લિક કરો.'
                          : 'કૃપા કરીને શોધ ફિલ્ટર સાફ કરો.'}
                      </p>
                      {students.length === 0 && (
                        <button
                          onClick={onAddNewStudent}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>+ નવો વિદ્યાર્થી ઉમેરો (Add New Student)</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>વર્ગ શિક્ષક: </span>
            <span className="font-semibold text-slate-800">{schoolConfig.classTeacher}</span>
            <span className="mx-2">·</span>
            <span>ધોરણ ૭ (અ)</span>
          </div>
          <div className="text-slate-400">
            * 'A' (ગેરહાજર) પર ક્લિક કરી વાલીને સીધો WhatsApp મેસેજ મોકલી શકાય છે.
          </div>
        </div>
      </div>

    </div>
  );
};
