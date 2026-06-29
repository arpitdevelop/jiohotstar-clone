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

export const MovieService = {
  getTrendingMovies: async (): Promise<Movie[]> => {
    if (!hasToken()) return moviesMock as Movie[];
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.trending);
      return response.data.results.map((movie) => ({ ...movie, media_type: "movie" }));
    } catch (e) {
      console.warn('Failed to fetch trending movies, using mock data:', e);
      return moviesMock as Movie[];
    }
  },

  getPopularMovies: async (): Promise<Movie[]> => {
    if (!hasToken()) return moviesMock as Movie[];
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.popular);
      return response.data.results.map((movie) => ({ ...movie, media_type: "movie" }));
    } catch (e) {
      console.warn('Failed to fetch popular movies, using mock data:', e);
      return moviesMock as Movie[];
    }
  },

  getTopRatedMovies: async (): Promise<Movie[]> => {
    if (!hasToken()) return [...moviesMock].reverse() as Movie[];
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.topRated);
      return response.data.results.map((movie) => ({ ...movie, media_type: "movie" }));
    } catch (e) {
      console.warn('Failed to fetch top rated movies, using mock data:', e);
      return [...moviesMock].reverse() as Movie[];
    }
  },

  getUpcomingMovies: async (): Promise<Movie[]> => {
    if (!hasToken()) return moviesMock.slice(1, 4) as Movie[];
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.upcoming);
      return response.data.results.map((movie) => ({ ...movie, media_type: "movie" }));
    } catch (e) {
      console.warn('Failed to fetch upcoming movies, using mock data:', e);
      return moviesMock.slice(1, 4) as Movie[];
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
      return moviesMock.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      ) as Movie[];
    }
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.searchMovies, {
        params: { query },
      });
      return response.data.results;
    } catch (e) {
      console.warn(`Failed to search movies for "${query}", using mock data:`, e);
      return moviesMock.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      ) as Movie[];
    }
  },
};
