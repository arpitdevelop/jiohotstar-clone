import { AppImage } from "@/components/common/AppImage";
import { getBackdropUrl, getPosterUrl } from "@/utils/image";
import { SharedImageKind } from "@/utils/movie-navigation";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface MediaTrailerHeroProps {
  backdropPath: string | null;
  posterPath: string | null;
  imageKind?: SharedImageKind;
  onClose: () => void;
}

export function MediaTrailerHero({
  backdropPath,
  posterPath,
  imageKind = "backdrop",
  onClose,
}: MediaTrailerHeroProps) {
  const heroUri =
    imageKind === "poster"
      ? getPosterUrl(posterPath, "w500")
      : getBackdropUrl(backdropPath, "w1280");

  return (
    <View className="relative mx-lg mt-sm h-[200px]">
      <Link.AppleZoomTarget>
        <View className="h-[200px] overflow-hidden rounded-2xl">
          <AppImage
            source={{ uri: heroUri }}
            className="h-full w-full bg-card"
          />
          <View className="absolute inset-0 bg-black/20" />
        </View>
      </Link.AppleZoomTarget>

      <View className="absolute inset-0 z-10" pointerEvents="box-none">
        <View className="absolute left-3 top-3" pointerEvents="none">
          <Text className="text-[10px] font-bold tracking-widest text-white">
            TRAILER
          </Text>
        </View>

        <TouchableOpacity
          onPress={onClose}
          hitSlop={12}
          activeOpacity={0.7}
          className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-black/40"
        >
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {posterPath ? (
          <View
            className="absolute bottom-3 right-3 h-10 w-16 overflow-hidden rounded"
            pointerEvents="none"
          >
            <AppImage
              source={{ uri: getPosterUrl(posterPath, "w185") }}
              contentFit="contain"
              className="h-full w-full"
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}
