import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Movie } from '@/types/movie';
import { MovieCard } from '../movie/MovieCard';
import { MovieRowSkeleton } from '../skeleton/MovieRowSkeleton';

interface MovieRowProps {
  title: string;
  movies?: Movie[];
  isLoading?: boolean;
}

export function MovieRow({ title, movies = [], isLoading = false }: MovieRowProps) {
  if (isLoading) {
    return <MovieRowSkeleton />;
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <View className="my-sm">
      <Text className="mb-sm px-lg text-base font-bold tracking-wide text-white">
        {title}
      </Text>
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard movie={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-lg pb-xs"
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View className="w-md" />}
      />
    </View>
  );
}
