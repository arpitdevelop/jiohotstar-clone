import { ScreenBackground } from "@/components/home/ScreenBackground";
import {
  buildMockEpisodes,
  EpisodeSection,
} from "@/components/movie/EpisodeSection";
import { MediaActionRow } from "@/components/movie/MediaActionRow";
import { MediaTrailerHero } from "@/components/movie/MediaTrailerHero";
import { MovieRow } from "@/components/sections/MovieRow";
import { MovieDetailSkeleton } from "@/components/skeleton/MovieDetailSkeleton";
import { useMovieDetails, useSimilarMovies } from "@/queries/movie.queries";
import { useSimilarTv, useTvDetails } from "@/queries/tv.queries";
import { formatShortDate, getReleaseYear, isRecentlyAdded } from "@/utils/date";
import { getContentRating, getLanguageName } from "@/utils/language";
import { SharedImageKind } from "@/utils/movie-navigation";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MovieDetailScreen() {
  const { id, type, sharedImageKind } = useLocalSearchParams<{
    id: string;
    type?: string;
    sharedImageKind?: SharedImageKind;
  }>();
  const movieId = Number(id);
  const mediaType = type === "tv" ? "tv" : "movie";
  const isTv = mediaType === "tv";
  const router = useRouter();
  const imageKind: SharedImageKind =
    sharedImageKind === "poster" ? "poster" : "backdrop";

  const movieDetails = useMovieDetails(movieId, mediaType === "movie");
  const tvDetails = useTvDetails(movieId, mediaType === "tv");
  const movieSimilar = useSimilarMovies(movieId, mediaType === "movie");
  const tvSimilar = useSimilarTv(movieId, mediaType === "tv");

  const {
    data: movie,
    isLoading,
    error,
  } = mediaType === "tv" ? tvDetails : movieDetails;
  const { data: similarMovies, isLoading: similarLoading } =
    mediaType === "tv" ? tvSimilar : movieSimilar;

  const handleShare = async () => {
    if (!movie) return;
    try {
      await Share.share({
        message: `Check out "${movie.title || movie.name}" on JioHotstar Clone! Overview: ${movie.overview}`,
      });
    } catch (e) {
      console.error("Error sharing:", e);
    }
  };

  if (!isLoading && (error || !movie)) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ScreenBackground />
        <Text className="mb-md text-foreground">
          Failed to load movie details.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-full bg-accent px-xl py-2.5"
        >
          <Text className="font-bold text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const title = movie?.title || movie?.name || "";
  const releaseDate = movie?.release_date || movie?.first_air_date;
  const releaseYear = getReleaseYear(releaseDate);
  const genres = movie?.genres?.map((g) => g.name) ?? [];
  const language = getLanguageName(movie?.original_language);
  const rating = getContentRating(movie?.vote_average);
  const showNewBadge = isRecentlyAdded(releaseDate);
  const episodes =
    isTv && movie ? buildMockEpisodes(title, movie.backdrop_path) : [];

  return (
    <View className="flex-1 bg-black">
      <ScreenBackground />
      <StatusBar style="light" />

      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-xxl"
        >
          <MediaTrailerHero
            mediaId={movieId}
            mediaType={mediaType}
            backdropPath={movie?.backdrop_path ?? null}
            posterPath={movie?.poster_path ?? null}
            imageKind={imageKind}
            onClose={() => router.back()}
          />

          {isLoading ? (
            <MovieDetailSkeleton />
          ) : movie ? (
            <>
          <View className="mt-lg items-center px-lg">
            <Text className="mb-sm text-center text-3xl font-bold text-white capitalize">
              {title}
            </Text>

            {showNewBadge ? (
              <Text className="mb-sm text-sm font-semibold text-[#4DB8FF]">
                Newly Added
              </Text>
            ) : null}

            <View className="flex-row flex-wrap items-center justify-center gap-2">
              <Text className="text-sm text-white/70">{releaseYear}</Text>
              <Text className="text-sm text-white/40">•</Text>
              <View className="rounded bg-white/15 px-1.5 py-0.5">
                <Text className="text-xs font-medium text-white/90">
                  {rating}
                </Text>
              </View>
              <Text className="text-sm text-white/40">•</Text>
              <Text className="text-sm text-white/70">{language}</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            className="mx-lg mt-lg flex-row items-center justify-center gap-2 rounded-full py-3.5"
            style={{ backgroundColor: "#D4DCE6" }}
            onPress={() =>
              alert(isTv ? "Playing latest episode..." : "Playing movie...")
            }
          >
            <Ionicons name="play" size={18} color="#000000" />
            <Text className="text-[15px] font-bold text-black">
              {isTv ? "Watch Latest Episode" : "Watch Now"}
            </Text>
            {isTv ? (
              <Text className="text-sm text-black/60">
                {formatShortDate(releaseDate)}
              </Text>
            ) : null}
          </TouchableOpacity>

          {genres.length > 0 ? (
            <Text className="mt-lg px-lg text-center text-xs text-white/60">
              {genres.join(" | ")}
            </Text>
          ) : null}

          <Text className="mt-md px-lg text-[13px] leading-5 text-white/60">
            {movie.overview}
          </Text>

          <View className="mt-lg">
            <MediaActionRow movie={movie} onShare={handleShare} />
          </View>

          {isTv && episodes.length > 0 ? (
            <EpisodeSection episodes={episodes} />
          ) : null}

          {similarMovies && similarMovies.length > 0 ? (
            <View className="mt-sm">
              <MovieRow
                title="More Like This"
                movies={similarMovies}
                isLoading={similarLoading}
              />
            </View>
          ) : null}
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
