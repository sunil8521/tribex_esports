export function formatDate12Hour(isoString: string): string {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "Invalid Date";

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Treat midnight timestamp as Date-only (no meaningful time)
  const isMidnight = hours === 0 && minutes === 0 && seconds === 0;

  if (isMidnight) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  return date
    .toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");
}
