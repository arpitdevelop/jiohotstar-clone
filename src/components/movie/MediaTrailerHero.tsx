import { AppImage } from "@/components/common/AppImage";
import { useMediaVideos } from "@/queries/video.queries";
import { getBackdropUrl, getPosterUrl } from "@/utils/image";
import { SharedImageKind } from "@/utils/movie-navigation";
import { getYouTubeReferer, pickTrailerVideo } from "@/utils/video";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import YoutubePlayer, { PLAYER_STATES } from "react-native-youtube-iframe";

const HERO_HEIGHT = 200;
const VIDEO_CROP_SCALE = 1.5;
const POSTER_HIDE_DELAY_MS = 500;

interface MediaTrailerHeroProps {
  mediaId: number;
  mediaType: "movie" | "tv";
  backdropPath: string | null;
  posterPath: string | null;
  imageKind?: SharedImageKind;
  onClose: () => void;
}

export function MediaTrailerHero({
  mediaId,
  mediaType,
  backdropPath,
  posterPath,
  imageKind = "backdrop",
  onClose,
}: MediaTrailerHeroProps) {
  const { width: screenWidth } = useWindowDimensions();
  const heroWidth = screenWidth - 32;
  const playerHeight = Math.round((heroWidth * 9) / 16);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const hidePosterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: videosData, isLoading: isVideosLoading } = useMediaVideos(
    mediaId,
    mediaType,
  );

  const trailer = useMemo(
    () => pickTrailerVideo(videosData?.results ?? []),
    [videosData?.results],
  );

  useEffect(() => {
    setIsVideoPlaying(false);
    setShouldPlay(false);

    return () => {
      if (hidePosterTimer.current) {
        clearTimeout(hidePosterTimer.current);
      }
    };
  }, [mediaId, trailer?.key]);

  const heroUri =
    imageKind === "poster"
      ? getPosterUrl(posterPath, "w500")
      : getBackdropUrl(backdropPath, "w1280");

  const showPoster = !isVideoPlaying;

  const handlePlayerReady = () => {
    setTimeout(() => setShouldPlay(true), 50);
  };

  const handlePlayerStateChange = (state: PLAYER_STATES) => {
    if (state !== PLAYER_STATES.PLAYING) return;

    if (hidePosterTimer.current) {
      clearTimeout(hidePosterTimer.current);
    }

    hidePosterTimer.current = setTimeout(() => {
      setIsVideoPlaying(true);
    }, POSTER_HIDE_DELAY_MS);
  };

  return (
    <View className="relative mx-lg mt-sm h-[200px]">
      <Link.AppleZoomTarget>
        <View className="h-[200px] overflow-hidden rounded-2xl bg-black">
          {trailer?.key ? (
            <View
              pointerEvents="none"
              className="absolute inset-0 items-center justify-center overflow-hidden"
            >
              <View
                style={{
                  width: heroWidth,
                  height: playerHeight,
                  transform: [{ scale: VIDEO_CROP_SCALE }],
                }}
              >
                <YoutubePlayer
                  height={playerHeight}
                  width={heroWidth}
                  videoId={trailer.key}
                  play={shouldPlay}
                  mute
                  forceAndroidAutoplay
                  useLocalHTML
                  baseUrlOverride={getYouTubeReferer()}
                  onReady={handlePlayerReady}
                  onChangeState={handlePlayerStateChange}
                  onError={() => {
                    setIsVideoPlaying(false);
                    setShouldPlay(false);
                  }}
                  initialPlayerParams={{
                    controls: false,
                    preventFullScreen: true,
                    rel: false,
                    loop: true,
                    iv_load_policy: 3,
                    modestbranding: true,
                  }}
                  webViewStyle={{ backgroundColor: "transparent" }}
                  webViewProps={{
                    domStorageEnabled: true,
                    allowsInlineMediaPlayback: true,
                    mediaPlaybackRequiresUserAction: false,
                    scrollEnabled: false,
                  }}
                />
              </View>
            </View>
          ) : null}

          {showPoster ? (
            <View className="absolute inset-0 z-[2] bg-black">
              <AppImage
                source={{ uri: heroUri }}
                className="h-full w-full bg-card"
              />
              <View
                className="absolute inset-0 bg-black/20"
                pointerEvents="none"
              />
            </View>
          ) : (
            <>
              <View
                className="absolute inset-x-0 top-0 z-[1] h-10"
                pointerEvents="none"
                style={{
                  experimental_backgroundImage:
                    "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 100%)",
                }}
              />
              <View
                className="absolute inset-x-0 bottom-0 z-[1] h-12"
                pointerEvents="none"
                style={{
                  experimental_backgroundImage:
                    "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
                }}
              />
            </>
          )}
        </View>
      </Link.AppleZoomTarget>

      <View className="absolute inset-0 z-10" pointerEvents="box-none">
        <View className="absolute left-3 top-3" pointerEvents="none">
          <Text className="text-[10px] font-bold tracking-widest text-white">
            {isVideosLoading && !trailer?.key ? "LOADING" : "TRAILER"}
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
      </View>
    </View>
  );
}
