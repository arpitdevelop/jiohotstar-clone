import { CategoryPillBar } from "@/components/home/CategoryPillBar";
import { ForYouHeader } from "@/components/home/ForYouHeader";
import { HomeTopButtons } from "@/components/home/HomeTopButtons";
import { ScreenBackground } from "@/components/home/ScreenBackground";
import { FeaturedCarousel } from "@/components/sections/FeaturedCarousel";
import { MovieRow } from "@/components/sections/MovieRow";
import { CarouselSkeleton } from "@/components/skeleton/CarouselSkeleton";
import { MovieRowSkeleton } from "@/components/skeleton/MovieRowSkeleton";
import {
  usePopularMovies,
  useTopRatedMovies,
  useTrendingMovies,
  useUpcomingMovies,
} from "@/queries/movie.queries";
import { useProfileDetails } from "@/queries/profile.queries";
import {
  useOnTheAirTv,
  usePopularTv,
  useTopRatedTv,
  useTrendingTv,
} from "@/queries/tv.queries";
import { useHomeCategoryStore } from "@/store/home-category.store";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const category = useHomeCategoryStore((state) => state.category);
  const language = useHomeCategoryStore((state) => state.language);
  const isMovies = category === "Movies";

  const { data: profile } = useProfileDetails();

  const movieTrending = useTrendingMovies(language);
  const moviePopular = usePopularMovies(language);
  const movieTopRated = useTopRatedMovies(language);
  const movieUpcoming = useUpcomingMovies(language);

  const tvTrending = useTrendingTv(language);
  const tvPopular = usePopularTv(language);
  const tvTopRated = useTopRatedTv(language);
  const tvOnTheAir = useOnTheAirTv(language);

  const trending = isMovies ? movieTrending : tvTrending;
  const popular = isMovies ? moviePopular : tvPopular;
  const topRated = isMovies ? movieTopRated : tvTopRated;
  const latest = isMovies ? movieUpcoming : tvOnTheAir;

  const isPageLoading =
    trending.isLoading ||
    popular.isLoading ||
    topRated.isLoading ||
    latest.isLoading;

  const continueWatchingTitle = profile
    ? `Continue Watching for ${profile.name}`
    : "Continue Watching";
  const latestRowTitle = isMovies ? "Upcoming Releases" : "On The Air";

  return (
    <View className="flex-1 bg-black">
      <ScreenBackground />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <HomeTopButtons />
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerClassName="pb-[180px]"
        >
          <ForYouHeader />

          {isPageLoading ? (
            <View>
              <CarouselSkeleton />
              <MovieRowSkeleton />
              <MovieRowSkeleton />
            </View>
          ) : (
            <View>
              {trending.data && (
                <FeaturedCarousel movies={trending.data.slice(0, 5)} />
              )}

              <MovieRow
                title={continueWatchingTitle}
                movies={popular.data}
                isLoading={popular.isLoading}
              />

              <MovieRow
                title="Trending Now"
                movies={trending.data}
                isLoading={trending.isLoading}
              />

              <MovieRow
                title="Critically Acclaimed"
                movies={topRated.data}
                isLoading={topRated.isLoading}
              />

              <MovieRow
                title={latestRowTitle}
                movies={latest.data}
                isLoading={latest.isLoading}
              />

              {/* <View className="mt-md">
                <PromoBanner />
              </View> */}
            </View>
          )}
        </ScrollView>
        <CategoryPillBar />
      </SafeAreaView>
    </View>
  );
}
