import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Movie } from '@/types/movie';
import { MovieCard } from '../movie/MovieCard';
import { MovieRowSkeleton } from '../skeleton/MovieRowSkeleton';

interface MovieRowProps {
  title: string;
  movies?: Movie[];
  isLoading?: boolean;
  type?: 'poster' | 'landscape' | 'continueWatching';
}

export const MovieRow = React.memo(function MovieRow({
  title,
  movies = [],
  isLoading = false,
  type = 'poster'
}: MovieRowProps) {
  if (isLoading) {
    return <MovieRowSkeleton type={type === 'landscape' ? 'landscape' : 'poster'} />;
  }

  if (movies.length === 0) {
    return null;
  }

  const isLandscape = type === 'landscape';

  return (
    <View className="my-sm">
      <Text className="mb-sm px-lg text-base font-bold tracking-wide text-white">
        {title}
      </Text>
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard movie={item} type={isLandscape ? 'landscape' : 'poster'} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-lg pb-xs"
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View className="w-md" />}
        windowSize={3}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
      />
    </View>
  );
});
