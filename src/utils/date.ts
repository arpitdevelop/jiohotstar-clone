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
