export async function getZodiacSign(dob) {
  const res = await fetch("https://dummyjson.com/c/1946-9e4d-4107-9a31");
  const data = await res.json();

  const date = new Date(dob);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return data.zodiacSigns.find((z) => {
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
  })?.sign;
}