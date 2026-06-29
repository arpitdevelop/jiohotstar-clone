import React from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppImage } from '@/components/common/AppImage';
import { useProfileDetails } from '@/queries/profile.queries';
import { useWatchlistStore } from '@/store/watchlist.store';
import { MovieCard } from '@/components/movie/MovieCard';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md * 2) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { data: profile, isLoading } = useProfileDetails();
  const { watchlist } = useWatchlistStore();
  const router = useRouter();

  const renderHeader = () => {
    if (isLoading || !profile) {
      return (
        <View className="mb-lg">
          <Text className="text-muted">Loading profile...</Text>
        </View>
      );
    }

    return (
      <View className="mb-lg">
        <View className="mb-xl flex-row items-center gap-lg">
          <AppImage
            source={{ uri: profile.avatar }}
            className="h-[72px] w-[72px] rounded-full border-2 border-border"
          />
          <View className="flex-1 justify-center">
            <Text className="mb-0.5 text-xl font-bold text-foreground">{profile.name}</Text>
            <Text className="mb-0.5 text-[13px] text-muted">{profile.email}</Text>
            <Text className="text-xs text-muted">{profile.mobileNo}</Text>
          </View>
        </View>

        <View className="mb-xxl flex-row items-center justify-between rounded-[10px] border border-border bg-card p-md">
          <View className="flex-row items-center gap-md">
            <Ionicons name="shield-checkmark" size={24} color="#E2B616" />
            <View>
              <Text className="text-[15px] font-bold text-foreground">
                JioHotstar {profile.subscriptionType}
              </Text>
              <Text className="mt-0.5 text-[11px] text-muted">
                Active • Member since {profile.memberSince}
              </Text>
            </View>
          </View>
          <View className="rounded bg-premium px-2 py-1">
            <Text className="text-[9px] font-extrabold text-black">GOLD</Text>
          </View>
        </View>

        <Text className="mb-md text-lg font-bold text-foreground">
          My Watchlist ({watchlist.length})
        </Text>
      </View>
    );
  };

  const renderEmptyWatchlist = () => {
    return (
      <View className="items-center justify-center px-xxl py-[60px]">
        <Ionicons name="bookmark-outline" size={48} color={colors.textSecondary} style={{ marginBottom: 8 }} />
        <Text className="mb-1 text-base font-semibold text-foreground">Your watchlist is empty</Text>
        <Text className="mb-xl text-center text-[13px] leading-[18px] text-muted">
          Explore movies and add them to your watchlist to watch them here.
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/')}
          className="rounded-md bg-accent px-xl py-2.5"
        >
          <Text className="text-sm font-bold text-white">Explore Movies</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={watchlist}
        renderItem={({ item }) => (
          <View className="mb-md flex-[0.33] items-center">
            <MovieCard movie={item} width={CARD_WIDTH} height={CARD_HEIGHT} />
          </View>
        )}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyWatchlist}
        contentContainerClassName="px-lg pt-lg pb-xxl"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
