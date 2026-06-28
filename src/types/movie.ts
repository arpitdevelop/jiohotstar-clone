export interface Movie {
  id: number;
  title?: string;
  name?: string; // For TV shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string; // For TV shows
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number | null;
  tagline?: string | null;
  media_type?: 'movie' | 'tv';
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieDetail extends Movie {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string | null;
  credits?: {
    cast: CastMember[];
  };
}
