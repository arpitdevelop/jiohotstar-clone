import api from "@/api/axios";
import { Endpoints } from "@/api/endpoints";
import { MediaVideosResponse } from "@/types/video";

const hasToken = () => !!process.env.EXPO_PUBLIC_TMDB_TOKEN;

export const VideoService = {
  getMovieVideos: async (id: number): Promise<MediaVideosResponse> => {
    if (!hasToken()) return { id, results: [] };
    const response = await api.get<MediaVideosResponse>(Endpoints.movieVideos(id), {
      params: { language: "en-US" },
    });
    return response.data;
  },

  getTvVideos: async (id: number): Promise<MediaVideosResponse> => {
    if (!hasToken()) return { id, results: [] };
    const response = await api.get<MediaVideosResponse>(Endpoints.tvVideos(id), {
      params: { language: "en-US" },
    });
    return response.data;
  },
};
