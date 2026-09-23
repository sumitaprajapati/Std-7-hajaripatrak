export type Gender = 'boy' | 'girl';

export type AttendanceStatus = 'P' | 'A' | 'L' | 'H'; // Present (હાજર), Absent (ગેરહાજર), Leave (રજા), Holiday (જાહેર રજા/રવિવાર)

export interface Student {
  id: string;
  rollNo: number;
  grNo: string; // General Register Number (જી.આર. નં.)
  name: string; // વિદ્યાર્થીનું પૂરું નામ
  fatherName: string; // પિતાનું નામ
  motherName: string; // માતાનું નામ
  gender: Gender; // કુમાર / કન્યા
  dob: string; // જન્મ તારીખ (YYYY-MM-DD)
  aadhaarDiseNo: string; // આધાર ડાયસ નંબર
  phone: string; // વાલીનો મોબાઇલ નં.
  address: string; // રહેઠાણ / ગામ (વાવડી)
  bloodGroup?: string;
  photoUrl: string; // Base64 or image URL
  category?: 'General' | 'OBC / SEBC' | 'SC' | 'ST';
  takesMdm: boolean; // મધ્યાહ્ન ભોજન લે છે?
}

export interface DayAttendance {
  status: AttendanceStatus;
  tookMdm?: boolean; // Took Mid-Day Meal on this day
  remark?: string; // Reason e.g. બીમારી, બહારગામ
  recordedAt?: string;
}

// Map of date string (YYYY-MM-DD) to student id to attendance
export type AttendanceDatabase = Record<string, Record<string, DayAttendance>>;

export interface SchoolConfig {
  schoolName: string;
  taluka: string;
  district: string;
  standard: string; // ધોરણ - ૭
  division: string; // વર્ગ - અ
  academicYear: string; // ૨૦૨૫-૨૬
  diseCode: string;
  classTeacher: string; // વર્ગ શિક્ષક: શ્રીમતી સુમિતાબેન પ્રજાપતિ
  principalName: string; // આચાર્યશ્રી: શ્રી એમ. આર. પટેલ
}
