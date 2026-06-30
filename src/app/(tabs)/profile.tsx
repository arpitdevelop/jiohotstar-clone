import { ScreenBackground } from "@/components/home/ScreenBackground";
import { ContinueWatchingRow } from "@/components/profile/ContinueWatchingRow";
import { JeetoPromoBanner } from "@/components/profile/JeetoPromoBanner";
import { ProfileAvatarsRow } from "@/components/profile/ProfileAvatarsRow";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SubscribeBanner } from "@/components/profile/SubscribeBanner";
import { WatchlistSection } from "@/components/profile/WatchlistSection";
import { usePopularMovies } from "@/queries/movie.queries";
import { useProfileDetails } from "@/queries/profile.queries";
import { useWatchlistStore } from "@/store/watchlist.store";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { data: profile, isLoading } = useProfileDetails();
  const { data: popularMovies, isLoading: isMoviesLoading } =
    usePopularMovies();
  const watchlist = useWatchlistStore((state) => state.watchlist);

  const continueWatchingTitle = profile
    ? `Continue Watching for ${profile.name}`
    : "Continue Watching";

  return (
    <View className="flex-1 bg-black">
      <ScreenBackground />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ProfileHeader />

        {isLoading || !profile ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#0078FF" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-[120px]"
          >
            <SubscribeBanner mobileNo={profile.mobileNo} />
            <ProfileAvatarsRow profiles={profile.profiles} />
            <JeetoPromoBanner />

            {isMoviesLoading ? (
              <View className="px-lg py-xl">
                <Text className="text-muted">Loading continue watching...</Text>
              </View>
            ) : (
              <ContinueWatchingRow
                title={continueWatchingTitle}
                movies={popularMovies}
              />
            )}

            <WatchlistSection watchlist={watchlist} />

            {/* <View className="mt-sm">
              <PromoBanner />
            </View> */}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
