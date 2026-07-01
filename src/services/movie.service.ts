import api from '@/api/axios';
import { Endpoints } from '@/api/endpoints';
import { Movie, MovieDetail } from '@/types/movie';
import { PaginatedResponse } from '@/types/api';
import moviesMock from '@/mocks/movies.json';

// Helper to check if TMDB token is present
const hasToken = () => !!process.env.EXPO_PUBLIC_TMDB_TOKEN;

// Map mock movies to MovieDetail format if needed
const getMockDetails = (id: number): MovieDetail => {
  const mock = moviesMock.find((m) => m.id === id) || moviesMock[0];
  return {
    ...mock,
    genres: mock.genres || [],
    runtime: mock.runtime ?? 120,
    tagline: mock.tagline ?? '',
    media_type: mock.media_type as 'movie' | 'tv' | undefined,
    credits: {
      cast: mock.cast || [],
    },
  };
};

const getMockMoviesForLanguage = (language?: string): Movie[] => {
  if (!language) return moviesMock as Movie[];
  const languageNames: Record<string, string> = {
    hi: "Hindi",
    en: "English",
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    kn: "Kannada",
  };
  const name = languageNames[language] || language;
  return moviesMock.map((movie) => ({
    ...movie,
    title: `${movie.title} (${name})`,
    original_language: language,
    media_type: "movie" as const,
  }));
};

export const MovieService = {
  getTrendingMovies: async (language?: string): Promise<Movie[]> => {
    if (!hasToken()) return getMockMoviesForLanguage(language);
    try {
      const response = language
        ? await api.get<PaginatedResponse<Movie>>('/discover/movie', { params: { with_original_language: language, sort_by: 'popularity.desc' } })
        : await api.get<PaginatedResponse<Movie>>(Endpoints.trending);
      return response.data.results.map((movie) => ({ ...movie, media_type: "movie" }));
    } catch (e) {
      console.warn('Failed to fetch trending movies, using mock data:', e);
      return getMockMoviesForLanguage(language);
    }
  },

  getPopularMovies: async (language?: string): Promise<Movie[]> => {
    if (!hasToken()) return getMockMoviesForLanguage(language);
    try {
      const response = language
        ? await api.get<PaginatedResponse<Movie>>('/discover/movie', { params: { with_original_language: language, sort_by: 'popularity.desc' } })
        : await api.get<PaginatedResponse<Movie>>(Endpoints.popular);
      return response.data.results.map((movie) => ({ ...movie, media_type: "movie" }));
    } catch (e) {
      console.warn('Failed to fetch popular movies, using mock data:', e);
      return getMockMoviesForLanguage(language);
    }
  },

  getTopRatedMovies: async (language?: string): Promise<Movie[]> => {
    if (!hasToken()) return [...getMockMoviesForLanguage(language)].reverse() as Movie[];
    try {
      const response = language
        ? await api.get<PaginatedResponse<Movie>>('/discover/movie', { params: { with_original_language: language, sort_by: 'vote_average.desc', 'vote_count.gte': 100 } })
        : await api.get<PaginatedResponse<Movie>>(Endpoints.topRated);
      return response.data.results.map((movie) => ({ ...movie, media_type: "movie" }));
    } catch (e) {
      console.warn('Failed to fetch top rated movies, using mock data:', e);
      return [...getMockMoviesForLanguage(language)].reverse() as Movie[];
    }
  },

  getUpcomingMovies: async (language?: string): Promise<Movie[]> => {
    if (!hasToken()) return getMockMoviesForLanguage(language).slice(1, 4) as Movie[];
    try {
      const response = language
        ? await api.get<PaginatedResponse<Movie>>('/discover/movie', { params: { with_original_language: language, sort_by: 'release_date.desc', 'release_date.gte': new Date().toISOString().split('T')[0] } })
        : await api.get<PaginatedResponse<Movie>>(Endpoints.upcoming);
      return response.data.results.map((movie) => ({ ...movie, media_type: "movie" }));
    } catch (e) {
      console.warn('Failed to fetch upcoming movies, using mock data:', e);
      return getMockMoviesForLanguage(language).slice(1, 4) as Movie[];
    }
  },

  getMovieDetails: async (id: number): Promise<MovieDetail> => {
    if (!hasToken()) return getMockDetails(id);
    try {
      // Fetch details and credits together
      const [detailRes, creditsRes] = await Promise.all([
        api.get<MovieDetail>(Endpoints.movieDetails(id)),
        api.get<{ cast: any[] }>(Endpoints.movieCredits(id)),
      ]);

      return {
        ...detailRes.data,
        credits: {
          cast: creditsRes.data.cast.slice(0, 10), // Limit to 10 members
        },
      };
    } catch (e) {
      console.warn(`Failed to fetch details for movie ${id}, using mock data:`, e);
      return getMockDetails(id);
    }
  },

  getSimilarMovies: async (id: number): Promise<Movie[]> => {
    if (!hasToken()) return moviesMock.filter((m) => m.id !== id) as Movie[];
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.similarMovies(id));
      return response.data.results;
    } catch (e) {
      console.warn(`Failed to fetch similar movies for ${id}, using mock data:`, e);
      return moviesMock.filter((m) => m.id !== id) as Movie[];
    }
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    if (!query.trim()) return [];
    if (!hasToken()) {
      const mockMovies = moviesMock.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      ) as Movie[];
      const mockTv = tvMock.filter((show) =>
        show.name.toLowerCase().includes(query.toLowerCase())
      ).map(show => ({ ...show, title: show.name, media_type: "tv" as const })) as unknown as Movie[];
      return [...mockMovies, ...mockTv];
    }
    try {
      const response = await api.get<PaginatedResponse<Movie>>('/search/multi', {
        params: { query },
      });
      return response.data.results.filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
      );
    } catch (e) {
      console.warn(`Failed to search movies for "${query}", using mock data:`, e);
      const mockMovies = moviesMock.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      ) as Movie[];
      const mockTv = tvMock.filter((show) =>
        show.name.toLowerCase().includes(query.toLowerCase())
      ).map(show => ({ ...show, title: show.name, media_type: "tv" as const })) as unknown as Movie[];
      return [...mockMovies, ...mockTv];
    }
  },

  discoverMoviesByGenre: async (genreId: number): Promise<Movie[]> => {
    if (!hasToken()) {
      return moviesMock.filter((m) =>
        m.genres?.some((g) => g.id === genreId)
      ) as Movie[];
    }
    try {
      const response = await api.get<PaginatedResponse<Movie>>('/discover/movie', {
        params: { with_genres: genreId, sort_by: 'popularity.desc' },
      });
      return response.data.results.map((m) => ({ ...m, media_type: 'movie' }));
    } catch (e) {
      console.warn(`Failed to discover movies for genre ${genreId}:`, e);
      return moviesMock.filter((m) =>
        m.genres?.some((g) => g.id === genreId)
      ) as Movie[];
    }
  },

  searchMoviesOnly: async (query: string): Promise<Movie[]> => {
    if (!query.trim()) return [];
    if (!hasToken()) {
      return moviesMock.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      ) as Movie[];
    }
    try {
      const response = await api.get<PaginatedResponse<Movie>>('/search/movie', {
        params: { query },
      });
      return response.data.results.map((m) => ({ ...m, media_type: 'movie' }));
    } catch (e) {
      console.warn(`Failed to search movies for "${query}":`, e);
      return moviesMock.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      ) as Movie[];
    }
  },
};
