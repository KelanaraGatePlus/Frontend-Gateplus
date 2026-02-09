export function calculateAge(dateOfBirth: string | Date): number {
  if (!dateOfBirth) return NaN;

  // validasi tanggal
  const birth = new Date(dateOfBirth);

  if (isNaN(birth.getTime())) return NaN;

  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return Number(age);
}
