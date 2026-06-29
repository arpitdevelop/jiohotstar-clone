import { TvService } from "@/services/tv.service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export const useTrendingTv = () => {
  return useQuery({
    queryKey: queryKeys.tv.trending(),
    queryFn: () => TvService.getTrendingTv(),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePopularTv = () => {
  return useQuery({
    queryKey: queryKeys.tv.popular(),
    queryFn: () => TvService.getPopularTv(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopRatedTv = () => {
  return useQuery({
    queryKey: queryKeys.tv.topRated(),
    queryFn: () => TvService.getTopRatedTv(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOnTheAirTv = () => {
  return useQuery({
    queryKey: queryKeys.tv.onTheAir(),
    queryFn: () => TvService.getOnTheAirTv(),
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
