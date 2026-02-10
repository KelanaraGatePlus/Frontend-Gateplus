export default function getMinAge(ageRestriction) {
  if (!ageRestriction) return null;

  const value = ageRestriction.toString().toUpperCase();

  // ambil angka dari string (17, 21, dll)
  const match = value.match(/\d+/);
  if (!match) return null;

  const age = Number(match[0]);

  // SU / R13 → bebas
  if (value.includes("SU") || value.includes("R13")) {
    return null;
  }

  return age;
}
