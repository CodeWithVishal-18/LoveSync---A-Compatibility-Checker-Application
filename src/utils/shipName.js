// Intelligent couple nickname / ship name generator

function cleanName(name) {
  return (name || '').trim().replace(/[^a-zA-Z]/g, '');
}

export function generateShipNames(name1, name2) {
  const n1 = cleanName(name1);
  const n2 = cleanName(name2);

  if (!n1 || !n2) return { primary: 'Lovebirds', secondary: 'Soulmates', all: ['Lovebirds', 'Soulmates'] };

  const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const half1 = Math.max(2, Math.floor(n1.length / 2));
  const half2 = Math.max(2, Math.floor(n2.length / 2));

  // Combinations
  const combo1 = cap(n1.slice(0, half1) + n2.slice(half2));
  const combo2 = cap(n2.slice(0, half2) + n1.slice(half1));
  const combo3 = cap(n1.slice(0, Math.min(3, n1.length)) + n2.toLowerCase());
  const combo4 = cap(n2.slice(0, Math.min(3, n2.length)) + n1.toLowerCase());

  const options = Array.from(new Set([combo1, combo2, combo3, combo4])).filter(
    (name) => name.length >= 3 && name.length <= 15
  );

  return {
    primary: options[0] || `${cap(n1.slice(0, 3))}${cap(n2.slice(0, 3))}`,
    secondary: options[1] || options[0],
    all: options.length ? options : [`${cap(n1.slice(0, 3))}${cap(n2.slice(0, 3))}`]
  };
}
