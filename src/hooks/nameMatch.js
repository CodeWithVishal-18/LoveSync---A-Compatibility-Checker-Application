export function getNameMatchScore(name1, name2) {
  const n1 = name1.toLowerCase();
  const n2 = name2.toLowerCase();

  let common = 0;

  for (let ch of n1) {
    if (n2.includes(ch)) common++;
  }

  const score = Math.min(
    100,
    Math.floor((common / Math.max(n1.length, n2.length)) * 100 + 40)
  );

  return score;
}