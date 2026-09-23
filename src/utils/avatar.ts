/**
 * Generates an SVG data URL for a student portrait based on gender, seed, and colors.
 * Used as high-fidelity fallback when user hasn't uploaded a photo yet.
 */
export function getStudentAvatar(gender: 'boy' | 'girl', seed: number, _name: string): string {
  const boyPalettes = [
    { skin: '#E0A97A', hair: '#1A1817', shirt: '#38BDF8', collar: '#0284C7', bg: '#E0F2FE' },
    { skin: '#C68B59', hair: '#261C14', shirt: '#60A5FA', collar: '#2563EB', bg: '#EFF6FF' },
    { skin: '#F1C27D', hair: '#1B1B1B', shirt: '#0284C7', collar: '#0369A1', bg: '#F0F9FF' },
    { skin: '#BA7A45', hair: '#171412', shirt: '#38BDF8', collar: '#0284C7', bg: '#E0F2FE' },
  ];

  const girlPalettes = [
    { skin: '#E0A97A', hair: '#1A1817', shirt: '#38BDF8', collar: '#DC2626', ribbon: '#EF4444', bg: '#FEE2E2' },
    { skin: '#C68B59', hair: '#261C14', shirt: '#60A5FA', collar: '#DC2626', ribbon: '#B91C1C', bg: '#FEF2F2' },
    { skin: '#F1C27D', hair: '#1B1B1B', shirt: '#38BDF8', collar: '#991B1B', ribbon: '#DC2626', bg: '#FFF1F2' },
    { skin: '#BA7A45', hair: '#171412', shirt: '#0284C7', collar: '#DC2626', ribbon: '#EF4444', bg: '#EFF6FF' },
  ];

  if (gender === 'boy') {
    const palette = boyPalettes[seed % boyPalettes.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" fill="${palette.bg}" rx="16"/>
      <!-- Body & Shirt -->
      <path d="M20,120 Q60,95 100,120 L100,120 L20,120 Z" fill="${palette.shirt}"/>
      <!-- Collar -->
      <polygon points="45,95 60,110 52,95" fill="${palette.collar}"/>
      <polygon points="75,95 60,110 68,95" fill="${palette.collar}"/>
      <polygon points="60,95 60,120" stroke="#CBD5E1" stroke-width="2"/>
      <!-- Neck -->
      <rect x="52" y="74" width="16" height="22" fill="${palette.skin}" rx="3"/>
      <!-- Face -->
      <ellipse cx="60" cy="58" rx="22" ry="24" fill="${palette.skin}"/>
      <!-- Ears -->
      <ellipse cx="37" cy="58" rx="4" ry="6" fill="${palette.skin}"/>
      <ellipse cx="83" cy="58" rx="4" ry="6" fill="${palette.skin}"/>
      <!-- Hair -->
      <path d="M37,50 Q36,32 60,32 Q84,32 83,50 C80,38 70,36 60,36 C48,36 41,40 37,50 Z" fill="${palette.hair}"/>
      <!-- Eyes -->
      <ellipse cx="52" cy="56" rx="2.5" ry="3" fill="#1E293B"/>
      <ellipse cx="68" cy="56" rx="2.5" ry="3" fill="#1E293B"/>
      <!-- Eyebrows -->
      <path d="M48,51 Q52,49 56,51" stroke="${palette.hair}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M64,51 Q68,49 72,51" stroke="${palette.hair}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Nose -->
      <path d="M60,56 L60,63 L62,64" stroke="#A16207" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <!-- Smile -->
      <path d="M54,69 Q60,74 66,69" stroke="#9A3412" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } else {
    const palette = girlPalettes[seed % girlPalettes.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" fill="${palette.bg}" rx="16"/>
      <!-- Hair Back / Braids -->
      <path d="M32,55 C26,75 30,105 34,115" stroke="${palette.hair}" stroke-width="9" stroke-linecap="round" fill="none"/>
      <path d="M88,55 C94,75 90,105 86,115" stroke="${palette.hair}" stroke-width="9" stroke-linecap="round" fill="none"/>
      <!-- Ribbons -->
      <circle cx="33" cy="98" r="4" fill="${palette.ribbon}"/>
      <circle cx="87" cy="98" r="4" fill="${palette.ribbon}"/>
      <!-- Body & Shirt -->
      <path d="M22,120 Q60,95 98,120 L98,120 L22,120 Z" fill="${palette.shirt}"/>
      <!-- Red Tie / Collar -->
      <polygon points="48,95 60,118 72,95" fill="${palette.collar}"/>
      <polygon points="56,95 60,118 64,95" fill="#7F1D1D"/>
      <!-- Neck -->
      <rect x="52" y="74" width="16" height="22" fill="${palette.skin}" rx="3"/>
      <!-- Face -->
      <ellipse cx="60" cy="58" rx="21" ry="23" fill="${palette.skin}"/>
      <!-- Ears with small earrings -->
      <ellipse cx="38" cy="58" rx="3.5" ry="5" fill="${palette.skin}"/>
      <ellipse cx="82" cy="58" rx="3.5" ry="5" fill="${palette.skin}"/>
      <circle cx="38" cy="61" r="1.5" fill="#EAB308"/>
      <circle cx="82" cy="61" r="1.5" fill="#EAB308"/>
      <!-- Hair Front -->
      <path d="M36,52 Q37,31 60,31 Q83,31 84,52 C81,38 72,36 60,37 C48,36 39,40 36,52 Z" fill="${palette.hair}"/>
      <!-- Small Bindi -->
      <circle cx="60" cy="50" r="1.2" fill="#DC2626"/>
      <!-- Eyes -->
      <ellipse cx="53" cy="56" rx="2.5" ry="2.8" fill="#1E293B"/>
      <ellipse cx="67" cy="56" rx="2.5" ry="2.8" fill="#1E293B"/>
      <!-- Eyebrows -->
      <path d="M49,52 Q53,50 57,52" stroke="${palette.hair}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M63,52 Q67,50 71,52" stroke="${palette.hair}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- Nose -->
      <path d="M60,56 L60,63 L61.5,64" stroke="#A16207" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <!-- Smile -->
      <path d="M54,69 Q60,73.5 66,69" stroke="#9A3412" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}
