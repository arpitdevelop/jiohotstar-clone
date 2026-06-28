export const formatDuration = (minutes?: number | null): string => {
  if (!minutes) return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
};
