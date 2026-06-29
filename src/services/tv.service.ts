import api from "@/api/axios";
import { Endpoints } from "@/api/endpoints";
import tvMock from "@/mocks/tv.json";
import { PaginatedResponse } from "@/types/api";
import { Movie, MovieDetail, CastMember } from "@/types/movie";

const hasToken = () => !!process.env.EXPO_PUBLIC_TMDB_TOKEN;

const getMockDetails = (id: number): MovieDetail => {
  const mock = tvMock.find((show) => show.id === id) || tvMock[0];
  return {
    ...mock,
    genres: mock.genres || [],
    runtime: null,
    tagline: "",
    media_type: "tv",
    credits: {
      cast: mock.cast || [],
    },
  };
};

export const TvService = {
  getTrendingTv: async (): Promise<Movie[]> => {
    if (!hasToken()) return tvMock as Movie[];
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.trendingTv);
      return response.data.results.map((show) => ({ ...show, media_type: "tv" }));
    } catch (e) {
      console.warn("Failed to fetch trending TV, using mock data:", e);
      return tvMock as Movie[];
    }
  },

  getPopularTv: async (): Promise<Movie[]> => {
    if (!hasToken()) return tvMock as Movie[];
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.popularTv);
      return response.data.results.map((show) => ({ ...show, media_type: "tv" }));
    } catch (e) {
      console.warn("Failed to fetch popular TV, using mock data:", e);
      return tvMock as Movie[];
    }
  },

  getTopRatedTv: async (): Promise<Movie[]> => {
    if (!hasToken()) return [...tvMock].reverse() as Movie[];
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.topRatedTv);
      return response.data.results.map((show) => ({ ...show, media_type: "tv" }));
    } catch (e) {
      console.warn("Failed to fetch top rated TV, using mock data:", e);
      return [...tvMock].reverse() as Movie[];
    }
  },

  getOnTheAirTv: async (): Promise<Movie[]> => {
    if (!hasToken()) return tvMock.slice(1, 4) as Movie[];
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.onTheAirTv);
      return response.data.results.map((show) => ({ ...show, media_type: "tv" }));
    } catch (e) {
      console.warn("Failed to fetch on the air TV, using mock data:", e);
      return tvMock.slice(1, 4) as Movie[];
    }
  },

  getTvDetails: async (id: number): Promise<MovieDetail> => {
    if (!hasToken()) return getMockDetails(id);
    try {
      const [detailRes, creditsRes] = await Promise.all([
        api.get<MovieDetail>(Endpoints.tvDetails(id)),
        api.get<{ cast: CastMember[] }>(Endpoints.tvCredits(id)),
      ]);

      return {
        ...detailRes.data,
        media_type: "tv",
        credits: {
          cast: creditsRes.data.cast.slice(0, 10),
        },
      };
    } catch (e) {
      console.warn(`Failed to fetch details for TV show ${id}, using mock data:`, e);
      return getMockDetails(id);
    }
  },

  getSimilarTv: async (id: number): Promise<Movie[]> => {
    if (!hasToken()) return tvMock.filter((show) => show.id !== id) as Movie[];
    try {
      const response = await api.get<PaginatedResponse<Movie>>(Endpoints.similarTv(id));
      return response.data.results.map((show) => ({ ...show, media_type: "tv" }));
    } catch (e) {
      console.warn(`Failed to fetch similar TV for ${id}, using mock data:`, e);
      return tvMock.filter((show) => show.id !== id) as Movie[];
    }
  },
};
