import { AppImage } from '@/components/common/AppImage';
import { Movie } from '@/types/movie';
import { buildMovieDetailRoute } from '@/utils/movie-navigation';
import { getPosterUrl } from '@/utils/image';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface ContinueWatchingCardProps {
  movie: Movie;
  episodeLabel?: string;
  timeLeft?: string;
  progress?: number;
  showEpisodeAsTitle?: boolean;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 112;

export function ContinueWatchingCard({
  movie,
  episodeLabel,
  timeLeft,
  progress = 0.35,
  showEpisodeAsTitle = false,
}: ContinueWatchingCardProps) {
  const title = movie.title ?? movie.name ?? 'Untitled';
  const displayEpisode = episodeLabel ?? `S1 E${(movie.id % 400) + 1}`;

  return (
    <Link href={buildMovieDetailRoute(movie, 'poster')} asChild>
      <Pressable style={{ width: CARD_WIDTH }}>
        <View
          className="relative overflow-hidden rounded-lg"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          <AppImage
            source={{ uri: getPosterUrl(movie.poster_path, 'w342') }}
            className="h-full w-full bg-card"
          />

          <View className="absolute bottom-2 left-2 h-7 w-7 items-center justify-center rounded-full bg-black/50">
            <Ionicons name="play" size={14} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </View>

          <View className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <View
              className="h-full bg-accent"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </View>
        </View>

        <View className="mt-2 flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-[13px] font-medium text-white" numberOfLines={1}>
              {showEpisodeAsTitle ? displayEpisode : title}
            </Text>
            <Text className="mt-0.5 text-[11px] text-muted">{timeLeft ?? '18m left'}</Text>
          </View>
          <Pressable hitSlop={8} className="pt-0.5">
            <Ionicons name="ellipsis-vertical" size={16} color="#8F98A6" />
          </Pressable>
        </View>
      </Pressable>
    </Link>
  );
}
