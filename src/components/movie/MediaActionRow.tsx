import { WatchlistButton } from "@/components/movie/WatchlistButton";
import { Movie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MediaActionRowProps {
  movie: Movie;
  onShare: () => void;
}

export function MediaActionRow({ movie, onShare }: MediaActionRowProps) {
  const [isRated, setIsRated] = useState(false);

  return (
    <View className="mb-xl flex-row items-center justify-around px-xl">
      <WatchlistButton movie={movie} variant="minimal" />

      <TouchableOpacity onPress={onShare} className="items-center gap-2">
        <Ionicons name="arrow-redo-outline" size={22} color="#FFFFFF" />
        <Text className="text-xs font-medium text-white/80">Share</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsRated((prev) => !prev)}
        className="items-center gap-2"
      >
        <Ionicons
          name={isRated ? "heart" : "heart-outline"}
          size={22}
          color={isRated ? "#FF4D6D" : "#FFFFFF"}
        />
        <Text className="text-xs font-medium text-white/80">Rate</Text>
      </TouchableOpacity>
    </View>
  );
}
