// Zodiac compatibility matrix with rich astrological interpretations & resilient fallback

const ELEMENT_MAP = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};

function getLocalCompatibility(z1, z2) {
  const el1 = ELEMENT_MAP[z1] || 'Fire';
  const el2 = ELEMENT_MAP[z2] || 'Fire';

  // Element synergy logic
  if (el1 === el2) {
    return {
      pair: [z1, z2],
      score: 88,
      elementSynergy: `${el1} + ${el2}`,
      message: `Shared ${el1} energy! You naturally understand each other's emotional rhythms and core desires.`
    };
  }

  const pairKey = [el1, el2].sort().join('+');

  if (pairKey === 'Air+Fire') {
    return {
      pair: [z1, z2],
      score: 93,
      elementSynergy: 'Air + Fire',
      message: 'Air feeds Fire! Your connection is electric, passionate, and filled with creative excitement and laughter.'
    };
  }

  if (pairKey === 'Earth+Water') {
    return {
      pair: [z1, z2],
      score: 91,
      elementSynergy: 'Earth + Water',
      message: 'Water nourishes Earth! A deeply grounded, nurturing relationship with tremendous loyalty and tenderness.'
    };
  }

  if (pairKey === 'Earth+Fire') {
    return {
      pair: [z1, z2],
      score: 74,
      elementSynergy: 'Earth + Fire',
      message: 'Dynamic balance! Passion meets practicality. Grounded stability helps harness boundless ambition.'
    };
  }

  if (pairKey === 'Air+Water') {
    return {
      pair: [z1, z2],
      score: 72,
      elementSynergy: 'Air + Water',
      message: 'Poetic blend of logic and intuition. You learn profound lessons from each other’s contrasting perspectives.'
    };
  }

  // Air + Earth or Fire + Water
  return {
    pair: [z1, z2],
    score: 78,
    elementSynergy: `${el1} + ${el2}`,
    message: 'Opposites attract! A magnetic combination where differences ignite curiosity and transformative growth.'
  };
}

export async function getCompatibility(zodiac1, zodiac2) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch("https://dummyjson.com/c/b75b-abd4-47bf-a1d8", {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const match = data.zodiacCompatibility?.find(
        (item) => item.pair.includes(zodiac1) && item.pair.includes(zodiac2)
      );
      if (match) return match;
    }
  } catch (err) {
    // Graceful offline fallback
  }

  return getLocalCompatibility(zodiac1, zodiac2);
}