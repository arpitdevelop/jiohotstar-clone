import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '@/types/movie';
import { useWatchlistStore } from '@/store/watchlist.store';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

interface WatchlistButtonProps {
  movie: Movie;
  variant?: 'vertical' | 'horizontal';
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

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={[
          styles.horizontalBtn,
          { 
            backgroundColor: isAdded ? colors.card : 'rgba(255, 255, 255, 0.1)',
            borderColor: colors.border
          }
        ]}
      >
        <Ionicons
          name={isAdded ? 'checkmark' : 'add'}
          size={20}
          color={isAdded ? colors.accent : colors.text}
        />
        <Text style={[styles.horizontalText, { color: colors.text }]}>
          {isAdded ? 'In Watchlist' : 'Add to Watchlist'}
        </Text>
      </TouchableOpacity>
    );
  }

  // Default vertical style (icon on top, label below)
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={styles.verticalBtn}
    >
      <View style={[styles.iconCircle, { backgroundColor: isAdded ? colors.card : 'rgba(255,255,255,0.08)', borderColor: colors.border }]}>
        <Ionicons
          name={isAdded ? 'checkmark' : 'add'}
          size={22}
          color={isAdded ? colors.accent : colors.text}
        />
      </View>
      <Text style={[styles.verticalText, { color: colors.textSecondary }]}>
        Watchlist
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  verticalBtn: {
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  verticalText: {
    fontSize: 11,
    fontWeight: '500',
  },
  horizontalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    borderWidth: 1,
    gap: Spacing.sm,
    flex: 1,
  },
  horizontalText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
