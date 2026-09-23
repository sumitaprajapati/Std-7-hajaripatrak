// Gujarati digits and language helpers

export const GUJARATI_DIGITS: Record<string, string> = {
  '0': '૦',
  '1': '૧',
  '2': '૨',
  '3': '૩',
  '4': '૪',
  '5': '૫',
  '6': '૬',
  '7': '૭',
  '8': '૮',
  '9': '૯',
};

export function toGujaratiDigits(num: number | string): string {
  if (num === undefined || num === null) return '';
  return String(num).replace(/[0-9]/g, (digit) => GUJARATI_DIGITS[digit] || digit);
}

export const GUJARATI_MONTHS = [
  { value: 1, gu: 'જાન્યુઆરી', en: 'January', days: 31 },
  { value: 2, gu: 'ફેબ્રુઆરી', en: 'February', days: 28 }, // leap year handled dynamically
  { value: 3, gu: 'માર્ચ', en: 'March', days: 31 },
  { value: 4, gu: 'એપ્રિલ', en: 'April', days: 30 },
  { value: 5, gu: 'મે', en: 'May', days: 31 },
  { value: 6, gu: 'જૂન', en: 'June', days: 30 },
  { value: 7, gu: 'જુલાઈ', en: 'July', days: 31 },
  { value: 8, gu: 'ઑગસ્ટ', en: 'August', days: 31 },
  { value: 9, gu: 'સપ્ટેમ્બર', en: 'September', days: 30 },
  { value: 10, gu: 'ઑક્ટોબર', en: 'October', days: 31 },
  { value: 11, gu: 'નવેમ્બર', en: 'November', days: 30 },
  { value: 12, gu: 'ડિસેમ્બર', en: 'December', days: 31 },
];

export const GUJARATI_DAYS = [
  'રવિવાર',
  'સોમવાર',
  'મંગળવાર',
  'બુધવાર',
  'ગુરુવાર',
  'શુક્રવાર',
  'શનિવાર',
];

export const GUJARATI_DAYS_SHORT = ['રવિ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ'];

export function formatGujaratiDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const dayNum = date.getDate();
  const monthIdx = date.getMonth();
  const year = date.getFullYear();
  const dayOfWeek = GUJARATI_DAYS[date.getDay()];
  const monthName = GUJARATI_MONTHS[monthIdx].gu;

  return `${toGujaratiDigits(dayNum)} ${monthName} ${toGujaratiDigits(year)}, ${dayOfWeek}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function isSunday(year: number, month: number, day: number): boolean {
  return new Date(year, month - 1, day).getDay() === 0;
}

export function getDayOfWeekName(year: number, month: number, day: number, isGujarati = true): string {
  const d = new Date(year, month - 1, day);
  const dayIdx = d.getDay();
  return isGujarati ? GUJARATI_DAYS_SHORT[dayIdx] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIdx];
}

// Generate WhatsApp absence alert link
export function generateAbsenceWhatsAppUrl(
  phone: string,
  studentName: string,
  schoolName: string,
  dateFormatted: string,
  teacherName: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const message = encodeURIComponent(
    `નમસ્તે વાલીશ્રી,\n\nઆપનો/આપની પાલ્ય *${studentName}* આજે તારીખ ${dateFormatted} ના રોજ *${schoolName}* માં ગેરહાજર છે.\nજો કોઈ વિશેષ કારણ હોય તો શાળાને જાણ કરવા નમ્ર વિનંતી.\n\nલી. વર્ગ શિક્ષક:\n${teacherName}\n${schoolName}`
  );
  return `https://wa.me/${finalPhone}?text=${message}`;
}
