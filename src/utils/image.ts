const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const getPosterUrl = (path: string | null, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342'): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=60'; // High quality fallback movie poster
  }
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w780'): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1000&auto=format&fit=crop&q=60'; // High quality fallback movie backdrop
  }
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const getProfileUrl = (path: string | null, size: 'w185' | 'h632' | 'original' = 'w185'): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60'; // Profile avatar fallback
  }
  return `${IMAGE_BASE_URL}${size}${path}`;
};
