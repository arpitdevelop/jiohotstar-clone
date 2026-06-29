import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { MovieService } from '@/services/movie.service';

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: queryKeys.movies.trending(),
    queryFn: () => MovieService.getTrendingMovies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePopularMovies = () => {
  return useQuery({
    queryKey: queryKeys.movies.popular(),
    queryFn: () => MovieService.getPopularMovies(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopRatedMovies = () => {
  return useQuery({
    queryKey: queryKeys.movies.topRated(),
    queryFn: () => MovieService.getTopRatedMovies(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: queryKeys.movies.upcoming(),
    queryFn: () => MovieService.getUpcomingMovies(),
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
