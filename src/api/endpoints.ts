export const Endpoints = {
  trending: '/trending/movie/day',
  popular: '/movie/popular',
  topRated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
  movieDetails: (id: number) => `/movie/${id}`,
  movieCredits: (id: number) => `/movie/${id}/credits`,
  similarMovies: (id: number) => `/movie/${id}/similar`,
  searchMovies: '/search/movie',
} as const;
