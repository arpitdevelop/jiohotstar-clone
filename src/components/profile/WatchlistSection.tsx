import { MovieCard } from '@/components/movie/MovieCard';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import { Movie } from '@/types/movie';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, Pressable, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md * 2) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface WatchlistSectionProps {
  watchlist: Movie[];
}

export function WatchlistSection({ watchlist }: WatchlistSectionProps) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View className="mb-lg">
      <Text className="mb-md px-lg text-base font-bold text-white">
        My Watchlist ({watchlist.length})
      </Text>

      {watchlist.length === 0 ? (
        <View className="items-center justify-center px-xxl py-xl">
          <Ionicons
            name="bookmark-outline"
            size={48}
            color={colors.textSecondary}
            style={{ marginBottom: 8 }}
          />
          <Text className="mb-1 text-base font-semibold text-white">
            Your watchlist is empty
          </Text>
          <Text className="mb-xl text-center text-[13px] leading-[18px] text-muted">
            Explore movies and add them to your watchlist to watch them here.
          </Text>
          <Pressable
            onPress={() => router.push('/')}
            className="rounded-md bg-accent px-xl py-2.5"
          >
            <Text className="text-sm font-bold text-white">Explore Movies</Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-md px-lg">
          {watchlist.map((movie) => (
            <View key={movie.id} className="items-center">
              <MovieCard movie={movie} width={CARD_WIDTH} height={CARD_HEIGHT} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
