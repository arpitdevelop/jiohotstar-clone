import { VideoService } from "@/services/video.service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export const useMovieVideos = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.movies.videos(id),
    queryFn: () => VideoService.getMovieVideos(id),
    staleTime: 30 * 60 * 1000,
    enabled: !!id && enabled,
  });
};

export const useTvVideos = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.tv.videos(id),
    queryFn: () => VideoService.getTvVideos(id),
    staleTime: 30 * 60 * 1000,
    enabled: !!id && enabled,
  });
};

export const useMediaVideos = (
  id: number,
  mediaType: "movie" | "tv",
  enabled = true,
) => {
  const movieVideos = useMovieVideos(id, mediaType === "movie" && enabled);
  const tvVideos = useTvVideos(id, mediaType === "tv" && enabled);
  return mediaType === "tv" ? tvVideos : movieVideos;
};
