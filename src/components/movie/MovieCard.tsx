import { AppImage } from "@/components/common/AppImage";
import { Movie } from "@/types/movie";
import { buildMovieDetailRoute } from "@/utils/movie-navigation";
import { getPosterUrl, getBackdropUrl } from "@/utils/image";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface MovieCardProps {
  movie: Movie;
  type?: 'poster' | 'landscape';
  width?: number;
  height?: number;
}

export function MovieCard({ movie, type = 'poster', width, height }: MovieCardProps) {
  const { colors } = useTheme();
  const isPremium = movie.vote_average >= 8.0;
  const isLandscape = type === 'landscape';

  const defaultWidth = isLandscape ? 200 : 110;
  const defaultHeight = isLandscape ? 112 : 165;
  const finalWidth = width ?? defaultWidth;
  const finalHeight = height ?? defaultHeight;

  const imageUri = isLandscape
    ? getBackdropUrl(movie.backdrop_path, "w780")
    : getPosterUrl(movie.poster_path, "w342");

  return (
    <Link href={buildMovieDetailRoute(movie, isLandscape ? "backdrop" : "poster")} asChild>
      <Pressable
        className="relative overflow-hidden rounded-lg shadow-md"
        style={{ width: finalWidth, height: finalHeight }}
      >
        <Link.AppleZoom>
          <View className="h-full w-full overflow-hidden rounded-lg">
            <AppImage
              source={{ uri: imageUri }}
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
