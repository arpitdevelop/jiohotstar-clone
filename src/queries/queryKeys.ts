export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    trending: () => [...queryKeys.movies.all, 'trending'] as const,
    popular: () => [...queryKeys.movies.all, 'popular'] as const,
    topRated: () => [...queryKeys.movies.all, 'topRated'] as const,
    upcoming: () => [...queryKeys.movies.all, 'upcoming'] as const,
    detail: (id: number) => [...queryKeys.movies.all, 'detail', id] as const,
    similar: (id: number) => [...queryKeys.movies.all, 'similar', id] as const,
    search: (query: string) => [...queryKeys.movies.all, 'search', query] as const,
  },
  profile: {
    details: ['profile', 'details'] as const,
  },
} as const;
