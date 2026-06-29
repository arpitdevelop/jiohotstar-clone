export const getReleaseYear = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  } catch (e) {
    return 'N/A';
  }
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};

export const formatShortDate = (dateStr?: string): string => {
  const date = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export const isRecentlyAdded = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return date >= cutoff;
  } catch {
    return false;
  }
};
