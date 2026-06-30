import { AppImage } from "@/components/common/AppImage";
import { useWatchlistStore } from "@/store/watchlist.store";
import { Movie } from "@/types/movie";
import { getBackdropUrl } from "@/utils/image";
import { buildMovieDetailRoute } from "@/utils/movie-navigation";
import { Ionicons } from "@expo/vector-icons";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { Link } from "expo-router";
import {
  Dimensions,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = 380;
const HORIZONTAL_INSET = (SCREEN_WIDTH - CARD_WIDTH) / 2;

interface FeaturedCarouselProps {
  movies: Movie[];
}

function getMovieMetadata(movie: Movie): string {
  const year =
    movie.release_date?.split("-")[0] ||
    movie.first_air_date?.split("-")[0] ||
    "";
  const parts = [year, "Hindi", "Drama", "Romance"].filter(Boolean);
  return parts.join(" • ");
}

export function FeaturedCarousel({ movies }: FeaturedCarouselProps) {
  const { addToWatchlist, removeFromWatchlist, inWatchlist } =
    useWatchlistStore();
  const useGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

  const renderItem = ({ item }: { item: Movie }) => {
    const isAdded = inWatchlist(item.id);
    const newlyAddedPill = (
      <View className="flex-row items-center gap-1 px-2.5 py-1">
        <Text className="text-[10px]">🎉</Text>
        <Text className="text-[10px] font-semibold text-white">
          Newly Added
        </Text>
      </View>
    );

    return (
      <View
        style={{
          width: SCREEN_WIDTH,
          height: CARD_HEIGHT,
          paddingHorizontal: HORIZONTAL_INSET,
        }}
      >
        <Link href={buildMovieDetailRoute(item, "backdrop")} asChild>
          <Pressable
            className="relative overflow-hidden rounded-3xl"
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
          >
            <Link.AppleZoom>
              <View
                className="h-full w-full overflow-hidden rounded-3xl"
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
              >
                <AppImage
                  source={{ uri: getBackdropUrl(item.backdrop_path, "w1280") }}
                  className="h-full w-full"
                />
                <View className="absolute inset-0 bg-black/20" />
                <View
                  className="absolute inset-x-0 bottom-0 h-32"
                  style={{
                    experimental_backgroundImage:
                      "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%)",
                  }}
                />
              </View>
            </Link.AppleZoom>

            <View className="absolute left-md top-md">
              {useGlass ? (
                <GlassView
                  glassEffectStyle="regular"
                  colorScheme="dark"
                  style={{ borderRadius: 999, overflow: "hidden" }}
                >
                  {newlyAddedPill}
                </GlassView>
              ) : (
                <View className="overflow-hidden rounded-full border border-white/15 bg-white/10">
                  {newlyAddedPill}
                </View>
              )}
            </View>

            <View className="absolute bottom-md left-md right-20">
              <Text
                numberOfLines={2}
                className="text-2xl font-extrabold text-white"
              >
                {item.title || item.name}
              </Text>
              <Text className="mt-1 text-xs text-white/60">
                {getMovieMetadata(item)}
              </Text>
            </View>

            <View className="absolute bottom-md right-md items-center gap-sm">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  isAdded ? removeFromWatchlist(item.id) : addToWatchlist(item)
                }
                className="h-9 w-9 items-center justify-center rounded-full bg-black/50"
              >
                <Ionicons
                  name={isAdded ? "checkmark" : "add"}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
                <Ionicons
                  name="play"
                  size={22}
                  color="#000000"
                  style={{ marginLeft: 2 }}
                />
              </View>
            </View>
          </Pressable>
        </Link>
      </View>
    );
  };

  if (movies.length === 0) return null;

  return (
    <View className="w-full items-center" style={{ height: CARD_HEIGHT }}>
      <Carousel
        data={movies}
        width={SCREEN_WIDTH}
        height={CARD_HEIGHT}
        renderItem={renderItem}
        mode="horizontal-stack"
        modeConfig={{
          snapDirection: "left",
          stackInterval: 18,
          scaleInterval: 0.04,
          opacityInterval: 0.08,
          rotateZDeg: 0,
        }}
        customConfig={() => ({ type: "positive", viewCount: 3 })}
        loop
        autoPlay
        autoPlayInterval={5000}
        scrollAnimationDuration={2000}
        style={{ width: SCREEN_WIDTH, height: CARD_HEIGHT }}
      />
    </View>
  );
}
