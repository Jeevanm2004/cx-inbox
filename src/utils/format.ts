export function formatWaitingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours}h ago`;
  }
  return `${hours}h ${remainingMins}m ago`;
}
