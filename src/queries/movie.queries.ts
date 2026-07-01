import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { MovieService } from '@/services/movie.service';

export const useTrendingMovies = (language?: string) => {
  return useQuery({
    queryKey: queryKeys.movies.trending(language),
    queryFn: () => MovieService.getTrendingMovies(language),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePopularMovies = (language?: string) => {
  return useQuery({
    queryKey: queryKeys.movies.popular(language),
    queryFn: () => MovieService.getPopularMovies(language),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopRatedMovies = (language?: string) => {
  return useQuery({
    queryKey: queryKeys.movies.topRated(language),
    queryFn: () => MovieService.getTopRatedMovies(language),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpcomingMovies = (language?: string) => {
  return useQuery({
    queryKey: queryKeys.movies.upcoming(language),
    queryFn: () => MovieService.getUpcomingMovies(language),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMovieDetails = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.movies.detail(id),
    queryFn: () => MovieService.getMovieDetails(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id && enabled,
  });
};

export const useSimilarMovies = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.movies.similar(id),
    queryFn: () => MovieService.getSimilarMovies(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id && enabled,
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: queryKeys.movies.search(query),
    queryFn: () => MovieService.searchMovies(query),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: query.trim().length > 0,
  });
};

export const useDiscoverMoviesByGenre = (genreId: number, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.movies.all, "discover", genreId],
    queryFn: () => MovieService.discoverMoviesByGenre(genreId),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};

export const useSearchMoviesOnly = (query: string, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.movies.all, "searchOnly", query],
    queryFn: () => MovieService.searchMoviesOnly(query),
    staleTime: 1 * 60 * 1000,
    enabled: enabled && query.trim().length > 0,
  });
};
