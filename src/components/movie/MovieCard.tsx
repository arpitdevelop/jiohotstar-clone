import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Movie } from '@/types/movie';
import { getPosterUrl } from '@/utils/image';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface MovieCardProps {
  movie: Movie;
  width?: number;
  height?: number;
}

export function MovieCard({ movie, width = 110, height = 165 }: MovieCardProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePress = () => {
    router.push({
      pathname: '/movie/[id]',
      params: { id: movie.id },
    });
  };

  const isPremium = movie.vote_average >= 8.0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[styles.container, { width, height }]}
    >
      <Image
        source={{ uri: getPosterUrl(movie.poster_path, 'w342') }}
        style={[styles.image, { backgroundColor: colors.card }]}
        resizeMode="cover"
      />
      {isPremium && (
        <View style={[styles.premiumBadge, { backgroundColor: colors.premium }]}>
          <Ionicons name="star" size={10} color="#000000" />
          <Text style={styles.premiumText}>GOLD</Text>
        </View>
      )}
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={11} color={colors.premium} />
        <Text style={[styles.ratingText, { color: colors.text }]}>
          {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  premiumBadge: {
    position: 'absolute',
    top: Spacing.xs,
    left: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    gap: 2,
  },
  premiumText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#000000',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: Spacing.xs,
    right: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    gap: 2,
  },
  ratingText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
