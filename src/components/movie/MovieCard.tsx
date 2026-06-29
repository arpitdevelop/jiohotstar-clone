import { AppImage } from "@/components/common/AppImage";
import { Movie } from "@/types/movie";
import { buildMovieDetailRoute } from "@/utils/movie-navigation";
import { getPosterUrl } from "@/utils/image";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface MovieCardProps {
  movie: Movie;
  width?: number;
  height?: number;
}

export function MovieCard({ movie, width = 110, height = 165 }: MovieCardProps) {
  const { colors } = useTheme();
  const isPremium = movie.vote_average >= 8.0;

  return (
    <Link href={buildMovieDetailRoute(movie, "poster")} asChild>
      <Pressable
        className="relative overflow-hidden rounded-lg shadow-md"
        style={{ width, height }}
      >
        <Link.AppleZoom>
          <View className="h-full w-full overflow-hidden rounded-lg">
            <AppImage
              source={{ uri: getPosterUrl(movie.poster_path, "w342") }}
              className="h-full w-full bg-card"
            />
          </View>
        </Link.AppleZoom>

        {isPremium && (
          <View className="absolute left-xs top-xs flex-row items-center gap-0.5 rounded bg-premium px-1 py-0.5">
            <Ionicons name="star" size={10} color="#000000" />
            <Text className="text-[8px] font-extrabold text-black">GOLD</Text>
          </View>
        )}
        <View className="absolute bottom-xs right-xs flex-row items-center gap-0.5 rounded bg-black/70 px-[5px] py-0.5">
          <Ionicons name="star" size={11} color={colors.premium} />
          <Text className="text-[9px] font-bold text-foreground">
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
