import { TvService } from "@/services/tv.service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export const useTrendingTv = (language?: string) => {
  return useQuery({
    queryKey: queryKeys.tv.trending(language),
    queryFn: () => TvService.getTrendingTv(language),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePopularTv = (language?: string) => {
  return useQuery({
    queryKey: queryKeys.tv.popular(language),
    queryFn: () => TvService.getPopularTv(language),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopRatedTv = (language?: string) => {
  return useQuery({
    queryKey: queryKeys.tv.topRated(language),
    queryFn: () => TvService.getTopRatedTv(language),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOnTheAirTv = (language?: string) => {
  return useQuery({
    queryKey: queryKeys.tv.onTheAir(language),
    queryFn: () => TvService.getOnTheAirTv(language),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTvDetails = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.tv.detail(id),
    queryFn: () => TvService.getTvDetails(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id && enabled,
  });
};

export const useSimilarTv = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.tv.similar(id),
    queryFn: () => TvService.getSimilarTv(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id && enabled,
  });
};

export const useDiscoverTvByGenre = (genreId: number, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.tv.all, "discover", genreId],
    queryFn: () => TvService.discoverTvByGenre(genreId),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};

export const useSearchTvOnly = (query: string, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.tv.all, "searchOnly", query],
    queryFn: () => TvService.searchTvOnly(query),
    staleTime: 1 * 60 * 1000,
    enabled: enabled && query.trim().length > 0,
  });
};
