import { Movie } from "@/types/movie";

export type SharedImageKind = "backdrop" | "poster";

export function buildMovieDetailRoute(movie: Movie, kind: SharedImageKind) {
  return {
    pathname: "/movie/[id]" as const,
    params: {
      id: String(movie.id),
      type: movie.media_type ?? "movie",
      sharedImageKind: kind,
    },
  };
}
