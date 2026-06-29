import { AppImage } from "@/components/common/AppImage";
import { getBackdropUrl } from "@/utils/image";
import { Text, View } from "react-native";

export interface Episode {
  id: number;
  name: string;
  episodeNumber: number;
  stillPath: string | null;
}

interface EpisodeSectionProps {
  seasonNumber?: number;
  episodes: Episode[];
}

export function EpisodeSection({
  seasonNumber = 1,
  episodes,
}: EpisodeSectionProps) {
  return (
    <View className="mb-xl">
      <View className="px-lg">
        <Text className="mb-3 text-base font-bold text-white">
          Season {seasonNumber}
        </Text>
        <View className="h-px bg-white/20" />
        <View className="h-0.5 w-20 bg-white" />
      </View>

      <View className="mt-md px-lg">
        {episodes.map((episode) => (
          <View key={episode.id} className="mb-md flex-row items-center gap-md">
            <AppImage
              source={{ uri: getBackdropUrl(episode.stillPath, "w780") }}
              className="h-[56px] w-[100px] rounded-md bg-card"
            />
            <Text className="flex-1 text-sm font-medium text-white">
              {episode.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function buildMockEpisodes(
  showName: string,
  backdropPath: string | null,
  count = 4,
): Episode[] {
  const firstWord = showName.split(" ")[0] || showName;

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    episodeNumber: index + 1,
    name:
      index === 0
        ? `${firstWord}'s Unique World`
        : `Episode ${index + 1}`,
    stillPath: backdropPath,
  }));
}
