export function getDobMatchScore(dob1, dob2) {
  const d1 = new Date(dob1);
  const d2 = new Date(dob2);

  const diffDays = Math.abs(
    (d1 - d2) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 30) return 90;
  if (diffDays < 180) return 80;
  if (diffDays < 365) return 70;
  return 60;
}