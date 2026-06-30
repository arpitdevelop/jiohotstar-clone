import { Movie } from '@/types/movie';
import { FlatList, Text, View } from 'react-native';
import { ContinueWatchingCard } from './ContinueWatchingCard';

const TIME_LEFT = ['18m left', '1m left', '42m left', '5m left'];

interface ContinueWatchingRowProps {
  title: string;
  movies?: Movie[];
}

export function ContinueWatchingRow({ title, movies = [] }: ContinueWatchingRowProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <View className="mb-lg">
      <Text className="mb-md px-lg text-base font-bold text-white">{title}</Text>
      <FlatList
        data={movies.slice(0, 6)}
        renderItem={({ item, index }) => (
          <ContinueWatchingCard
            movie={item}
            episodeLabel={`S1 E${(item.id % 400) + 1} • 14 Feb`}
            timeLeft={TIME_LEFT[index % TIME_LEFT.length]}
            progress={0.2 + (index % 4) * 0.18}
            showEpisodeAsTitle={index === 0}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-md px-lg"
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
