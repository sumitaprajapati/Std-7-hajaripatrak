import React, { useState, useRef } from 'react';
import { Student, SchoolConfig } from '../types/student';
import { toGujaratiDigits } from '../utils/gujarati';
import { Camera, Phone, MapPin, Edit3, Trash2, Plus, Printer, User } from 'lucide-react';

interface StudentDirectoryProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onAddNewStudent: () => void;
  onUpdateStudentPhoto: (studentId: string, newPhotoUrl: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onClearAllStudents?: () => void;
  schoolConfig: SchoolConfig;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  onSelectStudent,
  onAddNewStudent,
  onUpdateStudentPhoto,
  onDeleteStudent,
  onClearAllStudents,
  schoolConfig,
}) => {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'boy' | 'girl'>('all');
  const [activePhotoStudentId, setActivePhotoStudentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = students.filter(student => {
    if (genderFilter !== 'all' && student.gender !== genderFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = student.name.toLowerCase().includes(q);
      const matchFather = student.fatherName.toLowerCase().includes(q);
      const matchGr = student.grNo.includes(q);
      const matchRoll = String(student.rollNo).includes(q);
      if (!matchName && !matchFather && !matchGr && !matchRoll) return false;
    }
    return true;
  });

  const handlePhotoUploadClick = (studentId: string) => {
    setActivePhotoStudentId(studentId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activePhotoStudentId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateStudentPhoto(activePhotoStudentId, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden File Input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Directory Top Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>ધોરણ ૭ - સચિત્ર વિદ્યાર્થી યાદી</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
              {toGujaratiDigits(students.length)} વિદ્યાર્થી
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {schoolConfig.schoolName} · વર્ગ: {schoolConfig.division} · શૈક્ષણિક વર્ષ: {schoolConfig.academicYear}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>ID કાર્ડ્સ પ્રિન્ટ</span>
          </button>

          {students.length > 0 && onClearAllStudents && (
            <button
              onClick={onClearAllStudents}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              title="બધા જૂના વિદ્યાર્થીઓ કાઢી નાખો"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>બધા જૂના વિદ્યાર્થી કાઢી નાખો</span>
            </button>
          )}

          <button
            onClick={onAddNewStudent}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ નવો વિદ્યાર્થી ઉમેરો</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setGenderFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              genderFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            બધા ({students.length})
          </button>
          <button
            onClick={() => setGenderFilter('boy')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              genderFilter === 'boy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            કુમાર ({students.filter(s => s.gender === 'boy').length})
          </button>
          <button
            onClick={() => setGenderFilter('girl')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              genderFilter === 'girl' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            કન્યા ({students.filter(s => s.gender === 'girl').length})
          </button>
        </div>

        <input
          type="text"
          placeholder="નામ, રોલ નં., GR નં. અથવા વાલીનું નામ શોધો..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Grid of Student Cards with Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((student) => {
          return (
            <div
              key={student.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              {/* Header badge */}
              <div className="p-4 flex items-start gap-3.5">
                
                {/* Photo & Upload Hover Action */}
                <div className="relative group shrink-0">
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 rounded-xl object-cover border-2 border-slate-200 shadow-xs"
                  />
                  <button
                    onClick={() => handlePhotoUploadClick(student.id)}
                    className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center"
                    title="ફોટો બદલો (ફાઇલ અપલોડ)"
                  >
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span className="text-[9px] font-medium leading-tight">ફોટો બદલો</span>
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-amber-700 font-mono-numbers bg-amber-50 px-1.5 py-0.5 rounded">
                      રોલ નં. {toGujaratiDigits(student.rollNo)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono-numbers">
                      GR: {student.grNo}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mt-1 truncate">
                    {student.name}
                  </h3>

                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    પિતા: {student.fatherName}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span className={student.gender === 'boy' ? 'text-blue-600' : 'text-rose-600'}>
                      {student.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
                    </span>
                    <span>·</span>
                    <span>જન્મ: {student.dob}</span>
                  </div>
                </div>

              </div>

              {/* Extra details strip */}
              <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">આધાર ડાયસ:</span>
                  <span className="font-mono-numbers text-slate-700">{student.aadhaarDiseNo || '-'}</span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">સરનામું:</span>
                  <span className="text-slate-700 truncate max-w-[170px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {student.address}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">સંપર્ક / મોબાઇલ:</span>
                  <a
                    href={`tel:${student.phone}`}
                    className="text-amber-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {student.phone}
                  </a>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectStudent(student)}
                  className="px-2.5 py-1 text-slate-700 hover:text-amber-700 font-medium hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>વિગત સુધારો</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePhotoUploadClick(student.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                    title="નવો ફોટો અપલોડ કરો"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`શું તમે ખરેખર "${student.name}" નો રેકોર્ડ રદ કરવા માંગો છો?`)) {
                        onDeleteStudent(student.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                    title="વિદ્યાર્થી દૂર કરો"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-base">
              {students.length === 0
                ? 'હાલમાં કોઈ વિદ્યાર્થી નોંધાયેલ નથી'
                : 'કોઈ વિદ્યાર્થી મળ્યા નથી'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {students.length === 0
                ? 'તમારા વર્ગના નવા વિદ્યાર્થીઓ ઉમેરવા માટે નીચેના બટન પર ક્લિક કરો.'
                : 'શોધ શબ્દ તપાસો અથવા નવો વિદ્યાર્થી ઉમેરો.'}
            </p>
          </div>
          <button
            onClick={onAddNewStudent}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ નવો વિદ્યાર્થી ઉમેરો (Add Student)</span>
          </button>
        </div>
      )}

    </div>
  );
};
