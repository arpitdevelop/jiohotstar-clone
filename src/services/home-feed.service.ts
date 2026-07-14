import { Movie } from "@/types/movie";
import { MovieService } from "./movie.service";
import { TvService } from "./tv.service";
import moviesMock from "@/mocks/movies.json";
import tvMock from "@/mocks/tv.json";

export type HomeSection = {
  id: string;
  title: string;
  type: "poster" | "landscape" | "continueWatching" | "hero";
  endpoint: string;
};

const hasToken = () => !!process.env.EXPO_PUBLIC_TMDB_TOKEN;

// List of categories, genres, keywords to build over 100 sections
const SECTION_TEMPLATES = [
  // Curated Row Block (always first few items)
  { title: "Featured Blockbuster Carousel", type: "hero" as const, path: "/trending", isHero: true },
  { title: "Continue Watching", type: "continueWatching" as const, path: "/continue" },
  { title: "Trending Now", type: "poster" as const, path: "/trending" },
  { title: "Critically Acclaimed", type: "landscape" as const, path: "/top-rated" },
  { title: "Popular Choices", type: "poster" as const, path: "/popular" },
  { title: "New Arrivals", type: "landscape" as const, path: "/new" },

  // Studios & Brand collections
  { title: "Marvel Cinematic Universe", type: "poster" as const, path: "/keyword/marvel" },
  { title: "DC Multiverse", type: "landscape" as const, path: "/keyword/dc" },
  { title: "Disney Magic", type: "poster" as const, path: "/keyword/disney" },
  { title: "Pixar Favorites", type: "landscape" as const, path: "/keyword/pixar" },
  { title: "Star Wars Saga", type: "poster" as const, path: "/keyword/star wars" },
  { title: "HBO Classics", type: "landscape" as const, path: "/keyword/hbo" },
  { title: "Netflix Originals", type: "poster" as const, path: "/keyword/netflix" },
  { title: "Apple TV+ Hits", type: "landscape" as const, path: "/keyword/apple" },
  { title: "Amazon Prime Hits", type: "poster" as const, path: "/keyword/amazon" },
  { title: "Paramount Showcase", type: "landscape" as const, path: "/keyword/paramount" },

  // Movie/TV Genre specific rows
  { title: "High-Octane Action", type: "poster" as const, path: "/genre/action" },
  { title: "Laugh Out Loud Comedy", type: "landscape" as const, path: "/genre/comedy" },
  { title: "Epic Adventures", type: "poster" as const, path: "/genre/adventure" },
  { title: "Sci-Fi & Fantasy", type: "landscape" as const, path: "/genre/scifi" },
  { title: "Heartwarming Romance", type: "poster" as const, path: "/genre/romance" },
  { title: "Dark Mysteries", type: "landscape" as const, path: "/genre/mystery" },
  { title: "Edge of Your Seat Thrillers", type: "poster" as const, path: "/genre/thriller" },
  { title: "Horror Nights", type: "landscape" as const, path: "/genre/horror" },
  { title: "Family Fun Time", type: "poster" as const, path: "/genre/family" },
  { title: "Anime & Animation", type: "landscape" as const, path: "/genre/animation" },
  { title: "Intriguing Crime Dramas", type: "poster" as const, path: "/genre/crime" },
  { title: "Inspirational Documentaries", type: "landscape" as const, path: "/genre/documentary" },

  // Additional customized collections to reach 100+ items
  { title: "Oscar Winners", type: "poster" as const, path: "/keyword/oscar" },
  { title: "Emmy Award Winners", type: "landscape" as const, path: "/keyword/emmy" },
  { title: "Golden Globe Hits", type: "poster" as const, path: "/keyword/golden globe" },
  { title: "Hollywood Blockbusters", type: "landscape" as const, path: "/keyword/hollywood" },
  { title: "Hindi Cinema Classics", type: "poster" as const, path: "/keyword/hindi" },
  { title: "Korean Dramas (K-Dramas)", type: "landscape" as const, path: "/keyword/korean" },
  { title: "Japanese Anime Series", type: "poster" as const, path: "/keyword/anime" },
  { title: "British Masterpieces", type: "landscape" as const, path: "/keyword/bbc" },
  { title: "French Cinema Gems", type: "poster" as const, path: "/keyword/french" },
  { title: "Spanish Thrillers", type: "landscape" as const, path: "/keyword/spanish" },
  { title: "German Classics", type: "poster" as const, path: "/keyword/german" },
  { title: "Italian Cinema Highlights", type: "landscape" as const, path: "/keyword/italian" },
  { title: "Australian Adventures", type: "poster" as const, path: "/keyword/australian" },
  { title: "Top 10 Today", type: "landscape" as const, path: "/keyword/top 10" },
  { title: "Critics' Choice Picks", type: "poster" as const, path: "/keyword/critics" },
  { title: "Must-Watch Essentials", type: "landscape" as const, path: "/keyword/must watch" },
  { title: "Hidden Gems", type: "poster" as const, path: "/keyword/hidden gems" },
  { title: "Binge-Worthy Series", type: "landscape" as const, path: "/keyword/binge" },
  { title: "Family Movie Night", type: "poster" as const, path: "/keyword/family night" },
  { title: "Late Night Thrills", type: "landscape" as const, path: "/keyword/late night" },
  { title: "Cozy Chill Vibes", type: "poster" as const, path: "/keyword/cozy" },
  { title: "Cyberpunk & Tech", type: "landscape" as const, path: "/keyword/cyberpunk" },
  { title: "Time Travel Anomalies", type: "poster" as const, path: "/keyword/time travel" },
  { title: "Post-Apocalyptic Survival", type: "landscape" as const, path: "/keyword/apocalypse" },
  { title: "Medieval & Sword Fighting", type: "poster" as const, path: "/keyword/medieval" },
  { title: "True Crime Investigations", type: "landscape" as const, path: "/keyword/true crime" },
  { title: "Detective Investigations", type: "poster" as const, path: "/keyword/detective" },
  { title: "Sports & Sportsmanship", type: "landscape" as const, path: "/keyword/sports" },
  { title: "Musical Masterpieces", type: "poster" as const, path: "/keyword/music" },
  { title: "High School Drama & Comedy", type: "landscape" as const, path: "/keyword/school" },
  { title: "Rom-Com Favorites", type: "poster" as const, path: "/keyword/romcom" },
  { title: "Supernatural Encounters", type: "landscape" as const, path: "/keyword/supernatural" },
  { title: "Zombie Survival", type: "poster" as const, path: "/keyword/zombie" },
  { title: "Mythology & Legends", type: "landscape" as const, path: "/keyword/mythology" },
  { title: "Inspiring Biographies", type: "poster" as const, path: "/keyword/biography" },
  { title: "Stand-Up Comedy Specials", type: "landscape" as const, path: "/keyword/stand-up" },
  { title: "History & Royal Stories", type: "poster" as const, path: "/keyword/history" },
  { title: "Kids Corner Specials", type: "landscape" as const, path: "/keyword/kids" },
  { title: "Teen Romance Tales", type: "poster" as const, path: "/keyword/teen" },
  { title: "Magic & Illusion", type: "landscape" as const, path: "/keyword/magic" },
  { title: "Classic Film Noir", type: "poster" as const, path: "/keyword/noir" },
  { title: "Blockbuster Franchises", type: "landscape" as const, path: "/keyword/franchise" },
  { title: "Mind-Bending Sci-Fi", type: "poster" as const, path: "/keyword/mind-bending" },
  { title: "Survival Situations", type: "landscape" as const, path: "/keyword/survival" },
  { title: "Coming of Age Journeys", type: "poster" as const, path: "/keyword/coming of age" },
  { title: "Dark Comedy Bites", type: "landscape" as const, path: "/keyword/dark comedy" },
  { title: "Epic Space Operas", type: "poster" as const, path: "/keyword/space" },
  { title: "Alien Encounters", type: "landscape" as const, path: "/keyword/alien" },
  { title: "Superheroes Unite", type: "poster" as const, path: "/keyword/superhero" },
  { title: "Disaster & Survival", type: "landscape" as const, path: "/keyword/disaster" },
  { title: "Underdog Stories", type: "poster" as const, path: "/keyword/underdog" },
  { title: "Spy & Espionage", type: "landscape" as const, path: "/keyword/spy" },
  { title: "Martial Arts Showdown", type: "poster" as const, path: "/keyword/martial arts" },
  { title: "Cops & Robbers", type: "landscape" as const, path: "/keyword/cops" },
  { title: "Heist Operations", type: "poster" as const, path: "/keyword/heist" },
  { title: "Fantasy Realms", type: "landscape" as const, path: "/keyword/fantasy" },
  { title: "Ghost Stories", type: "poster" as const, path: "/keyword/ghost" },
  { title: "Vampires & Werewolves", type: "landscape" as const, path: "/keyword/vampire" },
  { title: "Witches & Covenants", type: "poster" as const, path: "/keyword/witch" },
  { title: "Treasure Hunting", type: "landscape" as const, path: "/keyword/treasure" },
  { title: "Road Trip Journeys", type: "poster" as const, path: "/keyword/road trip" },
  { title: "Courtroom Drama", type: "landscape" as const, path: "/keyword/court" },
  { title: "Political Intrigue", type: "poster" as const, path: "/keyword/politics" },
  { title: "Journalism & Truth", type: "landscape" as const, path: "/keyword/news" },
  { title: "Mental Health Stories", type: "poster" as const, path: "/keyword/mental" },
  { title: "Culinary Adventures", type: "landscape" as const, path: "/keyword/food" },
  { title: "Fashion & Style", type: "poster" as const, path: "/keyword/fashion" },
  { title: "Automotive & Racing", type: "landscape" as const, path: "/keyword/cars" },
  { title: "Wild West Tales", type: "poster" as const, path: "/keyword/western" },
  { title: "Military & Operations", type: "landscape" as const, path: "/keyword/military" },
  { title: "Rebellion & Freedom", type: "poster" as const, path: "/keyword/rebel" },
  { title: "Deep Ocean Secrets", type: "landscape" as const, path: "/keyword/ocean" },
  { title: "Into the Jungle", type: "poster" as const, path: "/keyword/jungle" },
  { title: "Mountain Explorers", type: "landscape" as const, path: "/keyword/mountain" },
  { title: "Gothic Tales", type: "poster" as const, path: "/keyword/gothic" },
  { title: "Steampunk Worlds", type: "landscape" as const, path: "/keyword/steampunk" },
  { title: "Artificial Intelligence", type: "poster" as const, path: "/keyword/ai" },
  { title: "Retro Nostalgia", type: "landscape" as const, path: "/keyword/retro" },
  { title: "Indie Hits", type: "poster" as const, path: "/keyword/indie" },
  { title: "Festival Favorites", type: "landscape" as const, path: "/keyword/festival" },
  { title: "Pop Culture Phenomena", type: "poster" as const, path: "/keyword/pop culture" },
  { title: "Urban Legends", type: "landscape" as const, path: "/keyword/urban" },
  { title: "Silent Era Classics", type: "poster" as const, path: "/keyword/silent" },
  { title: "Mockumentary Fun", type: "landscape" as const, path: "/keyword/mockumentary" },
  { title: "Sagas & Trilogies", type: "poster" as const, path: "/keyword/trilogy" },
  { title: "Twisty Mysteries", type: "landscape" as const, path: "/keyword/twist" },
  { title: "Slice of Life", type: "poster" as const, path: "/keyword/slice of life" },
  { title: "Satire & Parody", type: "landscape" as const, path: "/keyword/satire" },
  { title: "Epic Sagas", type: "poster" as const, path: "/keyword/saga" },
  { title: "Whodunit Crime", type: "landscape" as const, path: "/keyword/whodunit" }
];

// Helper mapping for genre IDs
const GENRE_MAP: Record<string, { movie: number; tv: number }> = {
  action: { movie: 28, tv: 10759 },
  comedy: { movie: 35, tv: 35 },
  adventure: { movie: 12, tv: 10759 },
  scifi: { movie: 878, tv: 10765 },
  romance: { movie: 10749, tv: 10766 },
  mystery: { movie: 9648, tv: 9648 },
  thriller: { movie: 53, tv: 9648 },
  horror: { movie: 27, tv: 9648 },
  family: { movie: 10751, tv: 10751 },
  animation: { movie: 16, tv: 16 },
  crime: { movie: 80, tv: 80 },
  documentary: { movie: 99, tv: 99 }
};

export const generateSectionsForFeed = (
  category: "TV" | "Movies",
  language?: string
): HomeSection[] => {
  const isMovies = category === "Movies";
  const prefix = isMovies ? "movie" : "tv";

  return SECTION_TEMPLATES.map((tpl, index) => {
    let endpoint = "";

    if (tpl.path === "/trending") {
      endpoint = isMovies ? "/movies/trending" : "/tv/trending";
    } else if (tpl.path === "/continue") {
      endpoint = isMovies ? "/movies/popular" : "/tv/popular";
    } else if (tpl.path === "/top-rated") {
      endpoint = isMovies ? "/movies/top-rated" : "/tv/top-rated";
    } else if (tpl.path === "/popular") {
      endpoint = isMovies ? "/movies/popular" : "/tv/popular";
    } else if (tpl.path === "/new") {
      endpoint = isMovies ? "/movies/upcoming" : "/tv/on-the-air";
    } else if (tpl.path.startsWith("/genre/")) {
      const genreKey = tpl.path.split("/")[2];
      const ids = GENRE_MAP[genreKey];
      const genreId = isMovies ? ids?.movie : ids?.tv;
      endpoint = `/discover/${prefix}?genre=${genreId || 28}`;
    } else if (tpl.path.startsWith("/keyword/")) {
      const keyword = tpl.path.split("/")[2];
      endpoint = `/discover/${prefix}?keyword=${encodeURIComponent(keyword)}`;
    }

    return {
      id: `${prefix}-section-${index}-${tpl.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      title: tpl.title,
      type: tpl.type,
      endpoint
    };
  });
};

export const HomeFeedService = {
  getHomeFeedSections: async (
    category: "TV" | "Movies",
    language: string | undefined,
    pageParam = 0,
    limit = 8
  ): Promise<{ sections: HomeSection[]; nextCursor: number | undefined }> => {
    // Delay slightly to simulate a real network request
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const allSections = generateSectionsForFeed(category, language);
    const start = pageParam * limit;
    const end = start + limit;
    const sections = allSections.slice(start, end);
    const hasMore = end < allSections.length;
    
    return {
      sections,
      nextCursor: hasMore ? pageParam + 1 : undefined
    };
  },

  getMockDataForSection: (section: HomeSection): Movie[] => {
    const isTv = section.endpoint.includes("/tv");
    const baseData = isTv ? tvMock : moviesMock;
    
    // Hash the section title to deterministically shuffle the mock data
    let hash = 0;
    for (let i = 0; i < section.title.length; i++) {
      hash = section.title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const shuffled = [...baseData];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.abs((hash + i) % (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    
    // Customize title slightly based on section so details feel unique
    return shuffled.map((item) => {
      const cleanTitle = item.title || item.name || "";
      const capitalizedSection = section.title.split(" ")[0];
      return {
        ...item,
        title: item.title ? `${cleanTitle} (${capitalizedSection})` : undefined,
        name: item.name ? `${cleanTitle} (${capitalizedSection})` : undefined
      };
    }) as Movie[];
  },

  fetchSectionData: async (section: HomeSection, language?: string): Promise<Movie[]> => {
    if (!hasToken()) {
      return HomeFeedService.getMockDataForSection(section);
    }

    try {
      const isTv = section.endpoint.includes("/tv");

      if (section.endpoint === "/movies/trending") {
        return await MovieService.getTrendingMovies(language);
      } else if (section.endpoint === "/movies/popular") {
        return await MovieService.getPopularMovies(language);
      } else if (section.endpoint === "/movies/top-rated") {
        return await MovieService.getTopRatedMovies(language);
      } else if (section.endpoint === "/movies/upcoming") {
        return await MovieService.getUpcomingMovies(language);
      } else if (section.endpoint === "/tv/trending") {
        return await TvService.getTrendingTv(language);
      } else if (section.endpoint === "/tv/popular") {
        return await TvService.getPopularTv(language);
      } else if (section.endpoint === "/tv/top-rated") {
        return await TvService.getTopRatedTv(language);
      } else if (section.endpoint === "/tv/on-the-air") {
        return await TvService.getOnTheAirTv(language);
      } else if (section.endpoint.includes("genre=")) {
        const match = section.endpoint.match(/genre=(\d+)/);
        const genreId = match ? parseInt(match[1]) : 28;
        return isTv
          ? await TvService.discoverTvByGenre(genreId)
          : await MovieService.discoverMoviesByGenre(genreId);
      } else if (section.endpoint.includes("keyword=")) {
        const match = section.endpoint.match(/keyword=([^&]+)/);
        const keyword = match ? decodeURIComponent(match[1]) : "";
        return isTv
          ? await TvService.searchTvOnly(keyword)
          : await MovieService.searchMovies(keyword);
      }

      return HomeFeedService.getMockDataForSection(section);
    } catch (e) {
      console.warn(`Failed to fetch section data for ${section.title}:`, e);
      return HomeFeedService.getMockDataForSection(section);
    }
  }
};
