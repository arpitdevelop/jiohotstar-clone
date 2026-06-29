import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '@/types/movie';
import { useWatchlistStore } from '@/store/watchlist.store';
import { useTheme } from '@/hooks/useTheme';

interface WatchlistButtonProps {
  movie: Movie;
  variant?: 'vertical' | 'horizontal' | 'minimal';
}

export function WatchlistButton({ movie, variant = 'vertical' }: WatchlistButtonProps) {
  const { colors } = useTheme();
  const { addToWatchlist, removeFromWatchlist, inWatchlist } = useWatchlistStore();

  const isAdded = inWatchlist(movie.id);

  const handlePress = () => {
    if (isAdded) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  if (variant === 'minimal') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        className="items-center gap-2"
      >
        <Ionicons
          name={isAdded ? 'checkmark' : 'add'}
          size={22}
          color={isAdded ? colors.accent : '#FFFFFF'}
        />
        <Text className="text-xs font-medium text-white/80">Watchlist</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        className="flex-1 flex-row items-center justify-center gap-sm rounded-lg border border-border px-xl py-3"
        style={{ backgroundColor: isAdded ? colors.card : 'rgba(255, 255, 255, 0.1)' }}
      >
        <Ionicons
          name={isAdded ? 'checkmark' : 'add'}
          size={20}
          color={isAdded ? colors.accent : colors.text}
        />
        <Text className="text-sm font-semibold text-foreground">
          {isAdded ? 'In Watchlist' : 'Add to Watchlist'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className="items-center gap-1.5"
    >
      <View
        className="h-11 w-11 items-center justify-center rounded-full border border-border"
        style={{ backgroundColor: isAdded ? colors.card : 'rgba(255,255,255,0.08)' }}
      >
        <Ionicons
          name={isAdded ? 'checkmark' : 'add'}
          size={22}
          color={isAdded ? colors.accent : colors.text}
        />
      </View>
      <Text className="text-[11px] font-medium text-muted">
        Watchlist
      </Text>
    </TouchableOpacity>
  );
}
