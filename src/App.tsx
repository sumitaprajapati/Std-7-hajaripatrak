/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Student, AttendanceDatabase, SchoolConfig, DayAttendance } from './types/student';
import { INITIAL_STUDENTS, INITIAL_SCHOOL_CONFIG, generateInitialAttendance } from './data/initialStudents';
import { Navbar, ActiveTab } from './components/Navbar';
import { DailyAttendance } from './components/DailyAttendance';
import { MonthlyRegister } from './components/MonthlyRegister';
import { StudentDirectory } from './components/StudentDirectory';
import { MdmReport } from './components/MdmReport';
import { StudentModal } from './components/StudentModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { PrintRegisterModal } from './components/PrintRegisterModal';

const STORAGE_KEY_STUDENTS = 'vavadi_std7_students_v2';
const STORAGE_KEY_CONFIG = 'vavadi_std7_config_v2';
const STORAGE_KEY_ATTENDANCE = 'vavadi_std7_attendance_v2';

export default function App() {
  // Initialize from LocalStorage or defaults
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDENTS;
  });

  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          schoolName: 'વાવડી પ્રાથમિક શાળા',
          classTeacher: 'શ્રીમતી પ્રજાપતિ સુમિતાબેન અશ્ર્વિનભાઈ',
          principalName: 'શ્રી કરણસિંહ.ઝેડ.ચાવડા',
        };
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SCHOOL_CONFIG;
  });

  const [attendanceDb, setAttendanceDb] = useState<AttendanceDatabase>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return generateInitialAttendance(INITIAL_STUDENTS);
  });

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [currentDate, setCurrentDate] = useState<string>(() => {
    const today = new Date();
    // Default to 2026-09-23 or today's ISO date
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  // Modals
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(schoolConfig));
  }, [schoolConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(attendanceDb));
  }, [attendanceDb]);

  // Handler: Update student attendance for currentDate
  const handleUpdateDailyAttendance = (studentId: string, updates: Partial<DayAttendance>) => {
    setAttendanceDb(prev => {
      const dayRecords = prev[currentDate] || {};
      const currentRecord = dayRecords[studentId] || { status: 'P', tookMdm: true };
      return {
        ...prev,
        [currentDate]: {
          ...dayRecords,
          [studentId]: {
            ...currentRecord,
            ...updates,
            recordedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  // Handler: Mark all students present for currentDate
  const handleMarkAllPresent = () => {
    setAttendanceDb(prev => {
      const dayRecords = { ...(prev[currentDate] || {}) };
      students.forEach(student => {
        dayRecords[student.id] = {
          status: 'P',
          tookMdm: student.takesMdm,
          remark: '',
          recordedAt: new Date().toISOString(),
        };
      });
      return {
        ...prev,
        [currentDate]: dayRecords,
      };
    });
  };

  // Handler: Update cell status directly in monthly register
  const handleUpdateMonthlyDayStatus = (
    dateStr: string,
    studentId: string,
    newStatus: 'P' | 'A' | 'L' | 'H'
  ) => {
    setAttendanceDb(prev => {
      const dayRecords = prev[dateStr] || {};
      const currentRecord = dayRecords[studentId] || { status: 'P', tookMdm: true };
      const student = students.find(s => s.id === studentId);
      return {
        ...prev,
        [dateStr]: {
          ...dayRecords,
          [studentId]: {
            ...currentRecord,
            status: newStatus,
            tookMdm: newStatus === 'P' ? (student?.takesMdm ?? true) : false,
          },
        },
      };
    });
  };

  // Handler: Update student photo directly
  const handleUpdateStudentPhoto = (studentId: string, newPhotoUrl: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, photoUrl: newPhotoUrl } : s))
    );
  };

  // Handler: Save Student (Add or Edit)
  const handleSaveStudent = (savedStudent: Student) => {
    if (editingStudent) {
      setStudents(prev =>
        prev.map(s => (s.id === savedStudent.id ? savedStudent : s))
      );
    } else {
      setStudents(prev => [...prev, savedStudent]);
      // Initialize attendance for today as present
      setAttendanceDb(prev => {
        const dayRecords = prev[currentDate] || {};
        return {
          ...prev,
          [currentDate]: {
            ...dayRecords,
            [savedStudent.id]: {
              status: 'P',
              tookMdm: savedStudent.takesMdm,
            },
          },
        };
      });
    }
  };

  // Handler: Delete student
  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setAttendanceDb(prev => {
      const next = { ...prev };
      for (const d in next) {
        if (next[d]?.[studentId]) {
          const dayCopy = { ...next[d] };
          delete dayCopy[studentId];
          next[d] = dayCopy;
        }
      }
      return next;
    });
  };

  // Handler: Clear all old students to start fresh
  const handleClearAllStudents = () => {
    if (confirm('શું તમે ખરેખર તમામ જૂના વિદ્યાર્થીઓ કાઢી નાખવા (Clear All) માંગો છો? આ પછી તમે તમારા નવા વિદ્યાર્થીઓ એક પછી એક સરળતાથી ઉમેરી શકશો.')) {
      setStudents([]);
      setAttendanceDb({});
    }
  };

  // Handler: Open Add Modal
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const backupData = {
      students,
      schoolConfig,
      attendanceDb,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vavadi_Std7_Hajari_Backup_${currentDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportBackup = (jsonString: string) => {
    const parsed = JSON.parse(jsonString);
    if (parsed.students && parsed.schoolConfig && parsed.attendanceDb) {
      setStudents(parsed.students);
      setSchoolConfig(parsed.schoolConfig);
      setAttendanceDb(parsed.attendanceDb);
    } else {
      throw new Error('Invalid schema');
    }
  };

  const handleResetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setSchoolConfig(INITIAL_SCHOOL_CONFIG);
    setAttendanceDb(generateInitialAttendance(INITIAL_STUDENTS));
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    localStorage.removeItem(STORAGE_KEY_ATTENDANCE);
  };

  const nextRollNumber = students.length > 0
    ? Math.max(...students.map(s => s.rollNo)) + 1
    : 1;

  const currentDayAttendance = attendanceDb[currentDate] || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Bar Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onAddNewStudent={handleOpenAddStudent}
        studentCount={students.length}
        classTeacher={schoolConfig.classTeacher}
        principalName={schoolConfig.principalName}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'daily' && (
          <DailyAttendance
            students={students}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            attendanceData={currentDayAttendance}
            onUpdateAttendance={handleUpdateDailyAttendance}
            onMarkAllPresent={handleMarkAllPresent}
            onSelectStudent={handleOpenEditStudent}
            onAddNewStudent={handleOpenAddStudent}
            onDeleteStudent={handleDeleteStudent}
            schoolConfig={schoolConfig}
          />
        )}

        {activeTab === 'monthly' && (
          <MonthlyRegister
            students={students}
            attendanceDb={attendanceDb}
            onUpdateDayStatus={handleUpdateMonthlyDayStatus}
            onOpenPrint={() => setIsPrintModalOpen(true)}
            schoolConfig={schoolConfig}
          />
        )}

        {activeTab === 'directory' && (
          <StudentDirectory
            students={students}
            onSelectStudent={handleOpenEditStudent}
            onAddNewStudent={handleOpenAddStudent}
            onUpdateStudentPhoto={handleUpdateStudentPhoto}
            onDeleteStudent={handleDeleteStudent}
            onClearAllStudents={handleClearAllStudents}
            schoolConfig={schoolConfig}
          />
        )}

        {activeTab === 'mdm' && (
          <MdmReport
            students={students}
            attendanceDb={attendanceDb}
            schoolConfig={schoolConfig}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>{schoolConfig.schoolName}</strong> · ધોરણ - ૭ (વર્ગ - {schoolConfig.division}) · હાજરી પત્રક
          </div>
          <div className="text-slate-500">
            વર્ગશિક્ષક: <strong className="text-slate-700 font-medium">{schoolConfig.classTeacher}</strong> · આચાર્ય: <strong className="text-slate-700 font-medium">{schoolConfig.principalName}</strong> · DISE: {schoolConfig.diseCode}
          </div>
        </div>
      </footer>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        onDelete={handleDeleteStudent}
        studentToEdit={editingStudent}
        nextRollNo={nextRollNumber}
      />

      {/* Print Register Modal */}
      <PrintRegisterModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        students={students}
        attendanceDb={attendanceDb}
        schoolConfig={schoolConfig}
      />

      {/* School Settings Modal */}
      <SchoolSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={schoolConfig}
        onSaveConfig={setSchoolConfig}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onResetDemoData={handleResetDemoData}
      />

    </div>
  );
}
