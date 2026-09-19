// Zodiac sign calculation with comprehensive offline astrological data

export const ZODIAC_DATA = [
  { sign: 'Capricorn', symbol: '♑', element: 'Earth', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { sign: 'Aquarius', symbol: '♒', element: 'Air', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { sign: 'Pisces', symbol: '♓', element: 'Water', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
  { sign: 'Aries', symbol: '♈', element: 'Fire', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { sign: 'Taurus', symbol: '♉', element: 'Earth', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { sign: 'Gemini', symbol: '♊', element: 'Air', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  { sign: 'Cancer', symbol: '♋', element: 'Water', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  { sign: 'Leo', symbol: '♌', element: 'Fire', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { sign: 'Virgo', symbol: '♍', element: 'Earth', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { sign: 'Libra', symbol: '♎', element: 'Air', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  { sign: 'Scorpio', symbol: '♏', element: 'Water', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  { sign: 'Sagittarius', symbol: '♐', element: 'Fire', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
];

export function calculateZodiacSync(dob) {
  if (!dob) return null;
  const date = new Date(dob);
  if (isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();
  if (year < 1920 || year > currentYear) return null;

  const day = date.getDate();
  const month = date.getMonth() + 1;

  const match = ZODIAC_DATA.find((z) => {
    const s = z.start;
    const e = z.end;

    if (s.month < e.month) {
      return (
        (month === s.month && day >= s.day) ||
        (month === e.month && day <= e.day) ||
        (month > s.month && month < e.month)
      );
    }

    // Handles Capricorn crossing year-end (Dec -> Jan)
    return (
      (month === s.month && day >= s.day) ||
      (month === e.month && day <= e.day) ||
      month > s.month ||
      month < e.month
    );
  });

  return match || ZODIAC_DATA[0];
}

export async function getZodiacSign(dob) {
  try {
    // Try external API with quick timeout, fallback to instant offline data
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch("https://dummyjson.com/c/1946-9e4d-4107-9a31", {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const date = new Date(dob);
      const day = date.getDate();
      const month = date.getMonth() + 1;

      const found = data.zodiacSigns?.find((z) => {
        const s = z.start;
        const e = z.end;
        if (s.month < e.month) {
          return (
            (month === s.month && day >= s.day) ||
            (month === e.month && day <= e.day) ||
            (month > s.month && month < e.month)
          );
        }
        return (
          (month === s.month && day >= s.day) ||
          (month === e.month && day <= e.day) ||
          month > s.month ||
          month < e.month
        );
      });
      if (found?.sign) return found.sign;
    }
  } catch (err) {
    // Graceful offline fallback
  }

  const local = calculateZodiacSync(dob);
  return local ? local.sign : "Aries";
}