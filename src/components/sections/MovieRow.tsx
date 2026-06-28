import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Movie } from '@/types/movie';
import { MovieCard } from '../movie/MovieCard';
import { MovieRowSkeleton } from '../skeleton/MovieRowSkeleton';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

interface MovieRowProps {
  title: string;
  movies?: Movie[];
  isLoading?: boolean;
}

export function MovieRow({ title, movies = [], isLoading = false }: MovieRowProps) {
  const { colors } = useTheme();

  if (isLoading) {
    return <MovieRowSkeleton />;
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard movie={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    letterSpacing: 0.25,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  separator: {
    width: Spacing.md,
  },
});
