export async function getCompatibility(zodiac1, zodiac2) {
  let res = await fetch("https://dummyjson.com/c/b75b-abd4-47bf-a1d8");
  let data = await res.json();

  return data.zodiacCompatibility.find(
    (item) =>item.pair.includes(zodiac1) && item.pair.includes(zodiac2));
}