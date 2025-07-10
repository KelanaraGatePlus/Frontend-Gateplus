export function formatDateTime(isoString, type = "long") {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date)) return "";

  if (type === "long") {
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("id-ID", options);
  }

  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleString("id-ID", options);
}
