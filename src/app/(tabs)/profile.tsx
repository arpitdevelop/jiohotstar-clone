import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
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
  const { colors, theme } = useTheme();
  const { data: profile, isLoading } = useProfileDetails();
  const { watchlist } = useWatchlistStore();
  const router = useRouter();

  const renderHeader = () => {
    if (isLoading || !profile) {
      return (
        <View style={styles.profileHeader}>
          <Text style={{ color: colors.textSecondary }}>Loading profile...</Text>
        </View>
      );
    }

    return (
      <View style={styles.profileHeader}>
        <View style={styles.userInfoRow}>
          <Image source={{ uri: profile.avatar }} style={[styles.avatar, { borderColor: colors.border }]} />
          <View style={styles.userTextContainer}>
            <Text style={[styles.userName, { color: colors.text }]}>{profile.name}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{profile.email}</Text>
            <Text style={[styles.userMobile, { color: colors.textSecondary }]}>{profile.mobileNo}</Text>
          </View>
        </View>

        {/* Subscription Card */}
        <View style={[styles.subscriptionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.subLeft}>
            <Ionicons name="shield-checkmark" size={24} color={colors.premium} />
            <View>
              <Text style={[styles.subTitle, { color: colors.text }]}>JioHotstar {profile.subscriptionType}</Text>
              <Text style={[styles.subExpiry, { color: colors.textSecondary }]}>Active • Member since {profile.memberSince}</Text>
            </View>
          </View>
          <View style={[styles.premiumBadge, { backgroundColor: colors.premium }]}>
            <Text style={styles.premiumText}>GOLD</Text>
          </View>
        </View>

        {/* Section Title */}
        <Text style={[styles.watchlistTitle, { color: colors.text }]}>My Watchlist ({watchlist.length})</Text>
      </View>
    );
  };

  const renderEmptyWatchlist = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bookmark-outline" size={48} color={colors.textSecondary} style={{ marginBottom: Spacing.sm }} />
        <Text style={[styles.emptyText, { color: colors.text }]}>Your watchlist is empty</Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
          Explore movies and add them to your watchlist to watch them here.
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/')}
          style={[styles.exploreBtn, { backgroundColor: colors.accent }]}
        >
          <Text style={styles.exploreBtnText}>Explore Movies</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={watchlist}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <MovieCard movie={item} width={CARD_WIDTH} height={CARD_HEIGHT} />
          </View>
        )}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyWatchlist}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  profileHeader: {
    marginBottom: Spacing.lg,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
  },
  userTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    marginBottom: 2,
  },
  userMobile: {
    fontSize: 12,
  },
  subscriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: Spacing.xxl,
  },
  subLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  subExpiry: {
    fontSize: 11,
    marginTop: 2,
  },
  premiumBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  premiumText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#000000',
  },
  watchlistTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  gridItem: {
    flex: 1/3,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 18,
  },
  exploreBtn: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.xl,
    borderRadius: 6,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
