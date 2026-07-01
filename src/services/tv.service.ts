import api from "@/api/axios";
import { Endpoints } from "@/api/endpoints";
import tvMock from "@/mocks/tv.json";
import { PaginatedResponse } from "@/types/api";
import { Movie, MovieDetail, CastMember } from "@/types/movie";

const hasToken = () => !!process.env.EXPO_PUBLIC_TMDB_TOKEN;

// Map mock movies to MovieDetail format if needed
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

const getMockTvForLanguage = (language?: string): Movie[] => {
  if (!language) return tvMock as Movie[];
  const languageNames: Record<string, string> = {
    hi: "Hindi",
    en: "English",
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    kn: "Kannada",
  };
  const name = languageNames[language] || language;
  return tvMock.map((show) => ({
    ...show,
    name: `${show.name} (${name})`,
    original_language: language,
    media_type: "tv" as const,
  }));
};

export const TvService = {
  getTrendingTv: async (language?: string): Promise<Movie[]> => {
    if (!hasToken()) return getMockTvForLanguage(language);
    try {
      const response = language
        ? await api.get<PaginatedResponse<Movie>>('/discover/tv', { params: { with_original_language: language, sort_by: 'popularity.desc' } })
        : await api.get<PaginatedResponse<Movie>>(Endpoints.trendingTv);
      return response.data.results.map((show) => ({ ...show, media_type: "tv" }));
    } catch (e) {
      console.warn("Failed to fetch trending TV, using mock data:", e);
      return getMockTvForLanguage(language);
    }
  },

  getPopularTv: async (language?: string): Promise<Movie[]> => {
    if (!hasToken()) return getMockTvForLanguage(language);
    try {
      const response = language
        ? await api.get<PaginatedResponse<Movie>>('/discover/tv', { params: { with_original_language: language, sort_by: 'popularity.desc' } })
        : await api.get<PaginatedResponse<Movie>>(Endpoints.popularTv);
      return response.data.results.map((show) => ({ ...show, media_type: "tv" }));
    } catch (e) {
      console.warn("Failed to fetch popular TV, using mock data:", e);
      return getMockTvForLanguage(language);
    }
  },

  getTopRatedTv: async (language?: string): Promise<Movie[]> => {
    if (!hasToken()) return [...getMockTvForLanguage(language)].reverse() as Movie[];
    try {
      const response = language
        ? await api.get<PaginatedResponse<Movie>>('/discover/tv', { params: { with_original_language: language, sort_by: 'vote_average.desc', 'vote_count.gte': 50 } })
        : await api.get<PaginatedResponse<Movie>>(Endpoints.topRatedTv);
      return response.data.results.map((show) => ({ ...show, media_type: "tv" }));
    } catch (e) {
      console.warn("Failed to fetch top rated TV, using mock data:", e);
      return [...getMockTvForLanguage(language)].reverse() as Movie[];
    }
  },

  getOnTheAirTv: async (language?: string): Promise<Movie[]> => {
    if (!hasToken()) return getMockTvForLanguage(language).slice(1, 4) as Movie[];
    try {
      const response = language
        ? await api.get<PaginatedResponse<Movie>>('/discover/tv', { params: { with_original_language: language, sort_by: 'first_air_date.desc' } })
        : await api.get<PaginatedResponse<Movie>>(Endpoints.onTheAirTv);
      return response.data.results.map((show) => ({ ...show, media_type: "tv" }));
    } catch (e) {
      console.warn("Failed to fetch on the air TV, using mock data:", e);
      return getMockTvForLanguage(language).slice(1, 4) as Movie[];
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

  discoverTvByGenre: async (genreId: number): Promise<Movie[]> => {
    if (!hasToken()) {
      return tvMock.filter((show) =>
        show.genres?.some((g) => g.id === genreId)
      ) as Movie[];
    }
    try {
      const response = await api.get<PaginatedResponse<Movie>>('/discover/tv', {
        params: { with_genres: genreId, sort_by: 'popularity.desc' },
      });
      return response.data.results.map((show) => ({ ...show, media_type: 'tv' }));
    } catch (e) {
      console.warn(`Failed to discover TV for genre ${genreId}:`, e);
      return tvMock.filter((show) =>
        show.genres?.some((g) => g.id === genreId)
      ) as Movie[];
    }
  },

  searchTvOnly: async (query: string): Promise<Movie[]> => {
    if (!query.trim()) return [];
    if (!hasToken()) {
      return tvMock.filter((show) =>
        show.name.toLowerCase().includes(query.toLowerCase())
      ).map(show => ({ ...show, title: show.name, media_type: "tv" as const })) as unknown as Movie[];
    }
    try {
      const response = await api.get<PaginatedResponse<Movie>>('/search/tv', {
        params: { query },
      });
      return response.data.results.map((show) => ({ ...show, media_type: 'tv' }));
    } catch (e) {
      console.warn(`Failed to search TV for "${query}":`, e);
      return tvMock.filter((show) =>
        show.name.toLowerCase().includes(query.toLowerCase())
      ).map(show => ({ ...show, title: show.name, media_type: "tv" as const })) as unknown as Movie[];
    }
  },
};
