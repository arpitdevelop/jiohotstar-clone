export const queryKeys = {
  movies: {
    all: ["movies"] as const,
    trending: (language?: string) => [...queryKeys.movies.all, "trending", language || "all"] as const,
    popular: (language?: string) => [...queryKeys.movies.all, "popular", language || "all"] as const,
    topRated: (language?: string) => [...queryKeys.movies.all, "topRated", language || "all"] as const,
    upcoming: (language?: string) => [...queryKeys.movies.all, "upcoming", language || "all"] as const,
    detail: (id: number) => [...queryKeys.movies.all, "detail", id] as const,
    videos: (id: number) => [...queryKeys.movies.all, "videos", id] as const,
    similar: (id: number) => [...queryKeys.movies.all, "similar", id] as const,
    search: (query: string) => [...queryKeys.movies.all, "search", query] as const,
  },
  tv: {
    all: ["tv"] as const,
    trending: (language?: string) => [...queryKeys.tv.all, "trending", language || "all"] as const,
    popular: (language?: string) => [...queryKeys.tv.all, "popular", language || "all"] as const,
    topRated: (language?: string) => [...queryKeys.tv.all, "topRated", language || "all"] as const,
    onTheAir: (language?: string) => [...queryKeys.tv.all, "onTheAir", language || "all"] as const,
    detail: (id: number) => [...queryKeys.tv.all, "detail", id] as const,
    videos: (id: number) => [...queryKeys.tv.all, "videos", id] as const,
    similar: (id: number) => [...queryKeys.tv.all, "similar", id] as const,
  },
  profile: {
    details: ['profile', 'details'] as const,
  },
} as const;
