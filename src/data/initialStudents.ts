import { Student, SchoolConfig, AttendanceDatabase, DayAttendance } from '../types/student';
import { getStudentAvatar } from '../utils/avatar';

export const INITIAL_SCHOOL_CONFIG: SchoolConfig = {
  schoolName: 'વાવડી પ્રાથમિક શાળા',
  taluka: 'મોરબી',
  district: 'મોરબી (ગુજરાત)',
  standard: 'ધોરણ - ૭',
  division: 'વર્ગ - અ',
  academicYear: '૨૦૨૫-૨૬',
  diseCode: '24090104501',
  classTeacher: 'શ્રીમતી પ્રજાપતિ સુમિતાબેન અશ્ર્વિનભાઈ',
  principalName: 'શ્રી કરણસિંહ.ઝેડ.ચાવડા',
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    rollNo: 1,
    grNo: '1421',
    name: 'પ્રજાપતિ આરવ સુરેશભાઈ',
    fatherName: 'સુરેશભાઈ અમૃતભાઈ પ્રજાપતિ',
    motherName: 'ગીતાબેન પ્રજાપતિ',
    gender: 'boy',
    dob: '2013-05-14',
    aadhaarDiseNo: '24090104501130001',
    phone: '9825143210',
    address: 'કુમાર શાળા પાસે, વાવડી',
    bloodGroup: 'B+',
    category: 'OBC / SEBC',
    photoUrl: getStudentAvatar('boy', 1, 'પ્રજાપતિ આરવ'),
    takesMdm: true,
  },
  {
    id: 'std-2',
    rollNo: 2,
    grNo: '1422',
    name: 'પટેલ દિયા હસમુખભાઈ',
    fatherName: 'હસમુખભાઈ કાંતિભાઈ પટેલ',
    motherName: 'મીનાબેન પટેલ',
    gender: 'girl',
    dob: '2013-08-22',
    aadhaarDiseNo: '24090104501130002',
    phone: '9879154321',
    address: 'પંચાયત ચોક, વાવડી',
    bloodGroup: 'A+',
    category: 'General',
    photoUrl: getStudentAvatar('girl', 2, 'પટેલ દિયા'),
    takesMdm: true,
  },
  {
    id: 'std-3',
    rollNo: 3,
    grNo: '1423',
    name: 'ઠાકોર સાહિલ મહેશજી',
    fatherName: 'મહેશજી લક્ષ્મણજી ઠાકોર',
    motherName: 'શાંતાબેન ઠાકોર',
    gender: 'boy',
    dob: '2013-02-10',
    aadhaarDiseNo: '24090104501130003',
    phone: '9712345678',
    address: 'નવો વાસ, વાવડી',
    bloodGroup: 'O+',
    category: 'OBC / SEBC',
    photoUrl: getStudentAvatar('boy', 3, 'ઠાકોર સાહિલ'),
    takesMdm: true,
  },
  {
    id: 'std-4',
    rollNo: 4,
    grNo: '1424',
    name: 'પરમાર પ્રિયા જગદીશભાઈ',
    fatherName: 'જગદીશભાઈ નથુભાઈ પરમાર',
    motherName: 'રેખાબેન પરમાર',
    gender: 'girl',
    dob: '2013-11-05',
    aadhaarDiseNo: '24090104501130004',
    phone: '9909876543',
    address: 'સ્ટેશન રોડ, વાવડી',
    bloodGroup: 'AB+',
    category: 'SC',
    photoUrl: getStudentAvatar('girl', 4, 'પરમાર પ્રિયા'),
    takesMdm: true,
  },
  {
    id: 'std-5',
    rollNo: 5,
    grNo: '1425',
    name: 'ચૌહાણ દર્શન રમેશભાઈ',
    fatherName: 'રમેશભાઈ બાબુભાઈ ચૌહાણ',
    motherName: 'વિમળાબેન ચૌહાણ',
    gender: 'boy',
    dob: '2013-04-18',
    aadhaarDiseNo: '24090104501130005',
    phone: '9428765432',
    address: 'રામજી મંદિર પાસે, વાવડી',
    bloodGroup: 'B+',
    category: 'OBC / SEBC',
    photoUrl: getStudentAvatar('boy', 5, 'ચૌહાણ દર્શન'),
    takesMdm: true,
  },
  {
    id: 'std-6',
    rollNo: 6,
    grNo: '1426',
    name: 'મકવાણા અંજલી દિનેશભાઈ',
    fatherName: 'દિનેશભાઈ કાનજીભાઈ મકવાણા',
    motherName: 'જયાબેન મકવાણા',
    gender: 'girl',
    dob: '2013-09-30',
    aadhaarDiseNo: '24090104501130006',
    phone: '9638527410',
    address: 'વાવડી જૂના પ્લોટ',
    bloodGroup: 'O+',
    category: 'SC',
    photoUrl: getStudentAvatar('girl', 6, 'મકવાણા અંજલી'),
    takesMdm: true,
  },
  {
    id: 'std-7',
    rollNo: 7,
    grNo: '1427',
    name: 'દેસાઈ રુદ્ર વિપુલભાઈ',
    fatherName: 'વિપુલભાઈ નવઘણભાઈ દેસાઈ',
    motherName: 'પૂજાબેન દેસાઈ',
    gender: 'boy',
    dob: '2013-01-12',
    aadhaarDiseNo: '24090104501130007',
    phone: '9876543219',
    address: 'ગોકુલ નગર, વાવડી',
    bloodGroup: 'A+',
    category: 'OBC / SEBC',
    photoUrl: getStudentAvatar('boy', 7, 'દેસાઈ રુદ્ર'),
    takesMdm: false,
  },
  {
    id: 'std-8',
    rollNo: 8,
    grNo: '1428',
    name: 'સોલંકી રિયા અશોકભાઈ',
    fatherName: 'અશોકભાઈ શાંતિલાલ સોલંકી',
    motherName: 'ભાવનાબેન સોલંકી',
    gender: 'girl',
    dob: '2013-07-19',
    aadhaarDiseNo: '24090104501130008',
    phone: '9512345670',
    address: 'શિવાજી ચોક, વાવડી',
    bloodGroup: 'B-',
    category: 'OBC / SEBC',
    photoUrl: getStudentAvatar('girl', 8, 'સોલંકી રિયા'),
    takesMdm: true,
  },
  {
    id: 'std-9',
    rollNo: 9,
    grNo: '1429',
    name: 'જોશી તીર્થ સંજયભાઈ',
    fatherName: 'સંજયભાઈ નરેન્દ્રભાઈ જોશી',
    motherName: 'નર્મદાબેન જોશી',
    gender: 'boy',
    dob: '2013-03-25',
    aadhaarDiseNo: '24090104501130009',
    phone: '9408123456',
    address: 'બ્રાહ્મણ શેરી, વાવડી',
    bloodGroup: 'O+',
    category: 'General',
    photoUrl: getStudentAvatar('boy', 9, 'જોશી તીર્થ'),
    takesMdm: true,
  },
  {
    id: 'std-10',
    rollNo: 10,
    grNo: '1430',
    name: 'ગોહિલ ખુશી પ્રવીણભાઈ',
    fatherName: 'પ્રવીણભાઈ નાથાભાઈ ગોહિલ',
    motherName: 'હંસાબેન ગોહિલ',
    gender: 'girl',
    dob: '2013-06-15',
    aadhaarDiseNo: '24090104501130010',
    phone: '9723456789',
    address: 'મુખ્ય બજાર, વાવડી',
    bloodGroup: 'A+',
    category: 'OBC / SEBC',
    photoUrl: getStudentAvatar('girl', 10, 'ગોહિલ ખુશી'),
    takesMdm: true,
  },
  {
    id: 'std-11',
    rollNo: 11,
    grNo: '1431',
    name: 'રાવળ કૃણાલ પંકજભાઈ',
    fatherName: 'પંકજભાઈ ચીમનભાઈ રાવળ',
    motherName: 'કૈલાસબેન રાવળ',
    gender: 'boy',
    dob: '2013-10-08',
    aadhaarDiseNo: '24090104501130011',
    phone: '9898765432',
    address: 'દરવાજા બહાર, વાવડી',
    bloodGroup: 'B+',
    category: 'OBC / SEBC',
    photoUrl: getStudentAvatar('boy', 11, 'રાવળ કૃણાલ'),
    takesMdm: true,
  },
  {
    id: 'std-12',
    rollNo: 12,
    grNo: '1432',
    name: 'વાઘેલા નેહા વિજયભાઈ',
    fatherName: 'વિજયભાઈ પ્રતાપભાઈ વાઘેલા',
    motherName: 'લીલાબેન વાઘેલા',
    gender: 'girl',
    dob: '2013-12-01',
    aadhaarDiseNo: '24090104501130012',
    phone: '9737123456',
    address: 'સત્યનારાયણ સોસાયટી, વાવડી',
    bloodGroup: 'O+',
    category: 'SC',
    photoUrl: getStudentAvatar('girl', 12, 'વાઘેલા નેહા'),
    takesMdm: true,
  },
  {
    id: 'std-13',
    rollNo: 13,
    grNo: '1433',
    name: 'પ્રજાપતિ હર્ષ દિલીપભાઈ',
    fatherName: 'દિલીપભાઈ નાનજીભાઈ પ્રજાપતિ',
    motherName: 'સરસ્વતીબેન પ્રજાપતિ',
    gender: 'boy',
    dob: '2013-04-03',
    aadhaarDiseNo: '24090104501130013',
    phone: '9824567890',
    address: 'કુંભાર વાસ, વાવડી',
    bloodGroup: 'AB+',
    category: 'OBC / SEBC',
    photoUrl: getStudentAvatar('boy', 13, 'પ્રજાપતિ હર્ષ'),
    takesMdm: true,
  },
  {
    id: 'std-14',
    rollNo: 14,
    grNo: '1434',
    name: 'પટેલ તન્વી જયેશભાઈ',
    fatherName: 'જયેશભાઈ મોહનભાઈ પટેલ',
    motherName: 'અલ્પાબેન પટેલ',
    gender: 'girl',
    dob: '2013-08-11',
    aadhaarDiseNo: '24090104501130014',
    phone: '9429876543',
    address: 'સરદાર ચોક, વાવડી',
    bloodGroup: 'B+',
    category: 'General',
    photoUrl: getStudentAvatar('girl', 14, 'પટેલ તન્વી'),
    takesMdm: false,
  },
  {
    id: 'std-15',
    rollNo: 15,
    grNo: '1435',
    name: 'ડાભી મનન ભરતભાઈ',
    fatherName: 'ભરતભાઈ હરિભાઈ ડાભી',
    motherName: 'કંચનબેન ડાભી',
    gender: 'boy',
    dob: '2013-09-17',
    aadhaarDiseNo: '24090104501130015',
    phone: '9687123450',
    address: 'વાવડી વાડી વિસ્તાર',
    bloodGroup: 'O-',
    category: 'OBC / SEBC',
    photoUrl: getStudentAvatar('boy', 15, 'ડાભી મનન'),
    takesMdm: true,
  },
];

// Generate realistic seeded attendance for September 2026 (or current month)
export function generateInitialAttendance(students: Student[]): AttendanceDatabase {
  const db: AttendanceDatabase = {};
  const year = 2026;
  const month = 9; // September

  // Generate days 1 to 23
  for (let day = 1; day <= 23; day++) {
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${year}-09-${dayStr}`;
    const d = new Date(year, month - 1, day);
    const isSun = d.getDay() === 0;

    db[dateKey] = {};

    students.forEach((student, idx) => {
      if (isSun) {
        db[dateKey][student.id] = { status: 'H', tookMdm: false };
      } else {
        // High attendance with realistic occasional absent/leave
        const hash = (day * 17 + idx * 23) % 100;
        let status: 'P' | 'A' | 'L' = 'P';
        let tookMdm = student.takesMdm;
        let remark = '';

        if (hash === 5 || hash === 38) {
          status = 'A';
          tookMdm = false;
        } else if (hash === 72) {
          status = 'L';
          tookMdm = false;
          remark = 'બીમારી';
        }

        db[dateKey][student.id] = {
          status,
          tookMdm,
          remark,
        };
      }
    });
  }

  return db;
}
