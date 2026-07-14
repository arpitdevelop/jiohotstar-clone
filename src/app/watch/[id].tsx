import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
  Alert,
  GestureResponderEvent,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { ScreenBackground } from "@/components/home/ScreenBackground";
import { WatchlistButton } from "@/components/movie/WatchlistButton";
import { MovieRow } from "@/components/sections/MovieRow";
import { PlayerSettingsSheet } from "@/components/movie/PlayerSettingsSheet";
import { useMovieDetails, useSimilarMovies } from "@/queries/movie.queries";
import { useSimilarTv, useTvDetails } from "@/queries/tv.queries";
import { getReleaseYear } from "@/utils/date";
import { getContentRating, getLanguageName } from "@/utils/language";
import { parseHlsPlaylist, HlsStream } from "@/utils/hlsParser";
import * as ScreenOrientation from "expo-screen-orientation";


const HLS_SOURCE_URI =
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export default function WatchScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type?: string }>();
  const movieId = Number(id);
  const mediaType = type === "tv" ? "tv" : "movie";
  const isTv = mediaType === "tv";

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isRated, setIsRated] = useState(false);
  const [isCustomFullscreen, setIsCustomFullscreen] = useState(false);
  const [settingsSheetVisible, setSettingsSheetVisible] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<HlsStream[]>([]);
  const [selectedQualityId, setSelectedQualityId] = useState<string>("auto");
  const [activeUrl, setActiveUrl] = useState<string>(HLS_SOURCE_URI);
  const pendingSeekTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch(HLS_SOURCE_URI)
      .then((res) => res.text())
      .then((text) => {
        if (active) {
          const parsed = parseHlsPlaylist(text, HLS_SOURCE_URI);
          setAvailableQualities(parsed);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch and parse master HLS playlist:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSelectQuality = async (opt: any) => {
    setSelectedQualityId(opt.id);
    const targetUrl = opt.id === "auto" ? HLS_SOURCE_URI : opt.url;
    if (targetUrl) {
      try {
        pendingSeekTimeRef.current = player.currentTime;
        setActiveUrl(targetUrl);
        await player.replaceAsync({ uri: targetUrl });
      } catch (err) {
        console.error("Failed to switch video quality:", err);
      }
    }
  };

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isManualToggle = useRef(false);
  const isLockedToPortrait = useRef(false);

  // Enable auto-rotation on mount, lock to portrait on unmount
  useEffect(() => {
    ScreenOrientation.unlockAsync().catch((err) =>
      console.warn("Failed to unlock orientation on mount:", err)
    );

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch((err) =>
        console.warn("Failed to lock orientation on unmount:", err)
      );
    };
  }, []);

  const handleToggleFullscreen = async (shouldFullscreen: boolean) => {
    isManualToggle.current = true;
    if (shouldFullscreen) {
      setIsCustomFullscreen(true);
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      setIsCustomFullscreen(false);
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  };

  useEffect(() => {
    if (isManualToggle.current) {
      if (isLandscape && isCustomFullscreen) {
        isManualToggle.current = false;
      } else if (!isLandscape && !isCustomFullscreen) {
        isManualToggle.current = false;
        // Keep screen orientation locked to portrait.
        // We will unlock it on first user interaction with the portrait layout.
        isLockedToPortrait.current = true;
      }
      return;
    }

    if (isLandscape) {
      setIsCustomFullscreen(true);
    } else {
      setIsCustomFullscreen(false);
    }
  }, [isLandscape]);

  // Video view reference for fullscreen
  const videoViewRef = useRef<VideoView>(null);

  // Initialize expo-video player
  const player = useVideoPlayer(HLS_SOURCE_URI, (playerInstance) => {
    playerInstance.timeUpdateEventInterval = 0.5; // Trigger timeUpdate events every 0.5 seconds
    playerInstance.loop = true;
    playerInstance.play();
  });

  // Track playback states locally
  const [isPlaying, setIsPlaying] = useState(player.playing);
  const [currentTime, setCurrentTime] = useState(player.currentTime);
  const [duration, setDuration] = useState(player.duration);

  // Set up event listeners for state sync
  useEventListener(player, "playingChange", (evt: any) => {
    setIsPlaying(evt.isPlaying);
  });

  useEventListener(player, "timeUpdate", (evt: any) => {
    setCurrentTime(evt.currentTime);
    if (player.duration !== duration) {
      setDuration(player.duration);
    }
  });

  useEventListener(player, "statusChange", (evt: any) => {
    setDuration(player.duration);
    if (evt?.status === "readyToPlay" && pendingSeekTimeRef.current !== null) {
      const seekTime = pendingSeekTimeRef.current;
      pendingSeekTimeRef.current = null;
      player.currentTime = seekTime;
      player.play();
    }
  });

  // Controls Visibility & Auto-Hide Timer
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<any>(null);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 4000);
  };

  const handlePlayerTap = () => {
    setControlsVisible((prev) => !prev);
  };

  useEffect(() => {
    if (controlsVisible) {
      resetControlsTimeout();
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [controlsVisible]);

  // Controls Opacity Animation
  const controlsOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(controlsOpacity, {
      toValue: controlsVisible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [controlsVisible]);

  // Floating skip indicators states and animations
  const [showBackwardIndicator, setShowBackwardIndicator] = useState(false);
  const [showForwardIndicator, setShowForwardIndicator] = useState(false);

  const backwardAnim = useRef(new Animated.Value(0)).current;
  const forwardAnim = useRef(new Animated.Value(0)).current;

  const triggerBackwardAnimation = () => {
    player.seekBy(-10);
    resetControlsTimeout();

    setShowBackwardIndicator(true);
    backwardAnim.setValue(0);
    Animated.timing(backwardAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start((result) => {
      if (result.finished) {
        setShowBackwardIndicator(false);
      }
    });
  };

  const triggerForwardAnimation = () => {
    player.seekBy(10);
    resetControlsTimeout();

    setShowForwardIndicator(true);
    forwardAnim.setValue(0);
    Animated.timing(forwardAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start((result) => {
      if (result.finished) {
        setShowForwardIndicator(false);
      }
    });
  };

  // Interpolations
  const backwardOpacity = backwardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const backwardTranslateX = backwardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });
  const backwardScale = backwardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const forwardOpacity = forwardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const forwardTranslateX = forwardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });
  const forwardScale = forwardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  // Seekbar sizing state to calculate coordinate ratio
  const [seekBarWidth, setSeekBarWidth] = useState(0);

  const handleSeekBarTouch = (event: GestureResponderEvent) => {
    if (seekBarWidth === 0 || !duration) return;
    const touchX = event.nativeEvent.locationX;
    const ratio = Math.max(0, Math.min(touchX / seekBarWidth, 1));
    player.currentTime = ratio * duration;
    resetControlsTimeout();
  };

  // Queries
  const movieDetails = useMovieDetails(movieId, mediaType === "movie");
  const tvDetails = useTvDetails(movieId, mediaType === "tv");
  const movieSimilar = useSimilarMovies(movieId, mediaType === "movie");
  const tvSimilar = useSimilarTv(movieId, mediaType === "tv");

  const { data: media, isLoading, error } = isTv ? tvDetails : movieDetails;
  const { data: similarMedia, isLoading: similarLoading } = isTv
    ? tvSimilar
    : movieSimilar;

  const handleShare = async () => {
    if (!media) return;
    try {
      await Share.share({
        message: `Watching "${media.title || media.name}" on JioHotstar Clone! Overview: ${media.overview}`,
      });
    } catch (e) {
      console.error("Error sharing:", e);
    }
  };

  const handleDownload = () => {
    Alert.alert(
      "Download Started",
      `Downloading "${media?.title || media?.name || "Video"}" to your library.`
    );
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const pad = (num: number) => String(num).padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
  };

  const getFormattedRuntime = (runtime?: number | null) => {
    if (!runtime) return "";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ScreenBackground />
        <Text className="text-foreground text-base">Loading Player...</Text>
      </View>
    );
  }

  if (error || !media) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-xl">
        <ScreenBackground />
        <Text className="text-foreground text-center mb-md text-base">
          Failed to load stream. Please try again.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-full bg-accent px-xl py-2.5"
        >
          <Text className="font-bold text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const title = media.title || media.name || "";
  const releaseDate = media.release_date || media.first_air_date;
  const releaseYear = getReleaseYear(releaseDate);
  const language = getLanguageName(media.original_language);
  const durationText = isTv
    ? media.number_of_seasons
      ? `${media.number_of_seasons} Season${media.number_of_seasons > 1 ? "s" : ""}`
      : "TV Series"
    : getFormattedRuntime(media.runtime);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Reusable player component rendering logic
  const renderPlayer = () => {
    return (
      <View
        className={`bg-black w-full justify-between relative overflow-hidden ${
          isCustomFullscreen ? "flex-1" : "aspect-video"
        }`}
      >
        {/* Main Video View with nativeControls={false} to handle overlays customly */}
        <TouchableWithoutFeedback onPress={handlePlayerTap}>
          <View className="absolute inset-0">
            <VideoView
              key={activeUrl}
              ref={videoViewRef}
              player={player}
              nativeControls={false}
              style={{ width: "100%", height: "100%" }}
              fullscreenOptions={{ enable: false }}
              allowsPictureInPicture
            />
          </View>
        </TouchableWithoutFeedback>

        {/* Control overlay wrapper */}
        <Animated.View
          pointerEvents={controlsVisible ? "auto" : "none"}
          style={{
            paddingTop: isCustomFullscreen ? Math.max(insets.top, 10) : 10,
            opacity: controlsOpacity,
          }}
          className="absolute inset-0 justify-between bg-black/40"
        >
          {/* Top Controls Row */}
          <View className="flex-row items-center justify-between px-lg py-2">
            <TouchableOpacity
              onPress={() => {
                if (isCustomFullscreen) {
                  handleToggleFullscreen(false);
                } else {
                  router.back();
                }
              }}
              className="p-1 rounded-full bg-black/40"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View className="flex-row items-center gap-xl">
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="desktop-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="copy-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSettingsSheetVisible(true);
                  setControlsVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleToggleFullscreen(!isCustomFullscreen)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isCustomFullscreen ? "contract-outline" : "expand-outline"}
                  size={22}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Center Controls Overlay with Play/Pause, Rewind, Fast Forward grouped closely in center */}
          <View pointerEvents="box-none" className="absolute inset-0 items-center justify-center z-10">
            <View pointerEvents="box-none" className="flex-row items-center justify-center gap-8">
              {/* Left Rewind Button */}
              <View className="relative items-center justify-center">
                {showBackwardIndicator && (
                  <Animated.View
                    style={{
                      position: "absolute",
                      left: -48,
                      opacity: backwardOpacity,
                      transform: [
                        { translateX: backwardTranslateX },
                        { scale: backwardScale },
                      ],
                    }}
                    pointerEvents="none"
                  >
                    <Text className="text-white text-[10px] font-bold bg-black/75 px-2 py-0.5 rounded-full overflow-hidden">
                      -10s
                    </Text>
                  </Animated.View>
                )}
                <TouchableOpacity
                  onPress={triggerBackwardAnimation}
                  className="p-2.5 bg-black/35 rounded-full"
                  activeOpacity={0.7}
                >
                  <Ionicons name="play-back" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Center Play/Pause button */}
              <TouchableOpacity
                onPress={() => {
                  if (isPlaying) {
                    player.pause();
                  } else {
                    player.play();
                  }
                  resetControlsTimeout();
                }}
                className="p-4 bg-black/50 rounded-full"
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={36}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              {/* Right Fast-Forward Button */}
              <View className="relative items-center justify-center">
                {showForwardIndicator && (
                  <Animated.View
                    style={{
                      position: "absolute",
                      right: -48,
                      opacity: forwardOpacity,
                      transform: [
                        { translateX: forwardTranslateX },
                        { scale: forwardScale },
                      ],
                    }}
                    pointerEvents="none"
                  >
                    <Text className="text-white text-[10px] font-bold bg-black/75 px-2 py-0.5 rounded-full overflow-hidden">
                      +10s
                    </Text>
                  </Animated.View>
                )}
                <TouchableOpacity
                  onPress={triggerForwardAnimation}
                  className="p-2.5 bg-black/35 rounded-full"
                  activeOpacity={0.7}
                >
                  <Ionicons name="play-forward" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bottom Progress Bar & Seek Timeline */}
          <View className="px-lg pb-sm bg-gradient-to-t from-black/60 to-transparent">
            <View className="flex-row items-center justify-between mb-1">
              {/* Scrubber Seekbar Wrapper */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={handleSeekBarTouch}
                onLayout={(e) => setSeekBarWidth(e.nativeEvent.layout.width)}
                className="relative flex-1 h-3 justify-center mr-sm"
              >
                <View
                  pointerEvents="none"
                  className="h-[3px] bg-white/20 rounded-full w-full relative justify-center"
                >
                  {/* Highlighted played section */}
                  <View
                    className="absolute left-0 top-0 h-[3px] bg-white rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />

                  {/* Yellow key indicators / markers */}
                  <View className="absolute left-[20%] top-[-1px] w-[5px] h-[5px] bg-[#E2B616] rounded-full" />
                  <View className="absolute left-[50%] top-[-1px] w-[5px] h-[5px] bg-[#E2B616] rounded-full" />
                  <View className="absolute left-[75%] top-[-1px] w-[5px] h-[5px] bg-[#E2B616] rounded-full" />

                  {/* Scrubber Knob */}
                  <View
                    className="absolute top-[-4px] w-3 h-3 bg-white rounded-full shadow"
                    style={{
                      left: `${progressPercentage}%`,
                      transform: [{ translateX: -6 }],
                    }}
                  />
                </View>
              </TouchableOpacity>

              <Text className="text-[11px] font-semibold text-white/90">
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden={isCustomFullscreen} style="light" />
      <ScreenBackground />

      {/* Safe Area Top Spacer (Only show if inline) */}
      {!isCustomFullscreen && (
        <View style={{ height: insets.top, backgroundColor: "#000000" }} />
      )}

      {/* Root Container */}
      <View className="flex-1">
        {isCustomFullscreen ? (
          /* Fullscreen mode: cover whole view */
          <View className="absolute inset-0 z-50 bg-black">
            {renderPlayer()}
          </View>
        ) : (
          /* Scroll view layout for inline details */
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            onTouchStart={() => {
              if (isLockedToPortrait.current) {
                isLockedToPortrait.current = false;
                ScreenOrientation.unlockAsync().catch((err) =>
                  console.warn("Failed to unlock orientation on touch:", err)
                );
              }
            }}
          >
            {renderPlayer()}

            {/* Movie Metadata Details */}
            <View className="px-lg pt-lg pb-md">
              <Text className="text-white text-2xl font-bold mb-xs tracking-wide">
                {title}
              </Text>

              <View className="flex-row items-center gap-2 mb-lg">
                <Text className="text-white/60 text-[13px]">{releaseYear}</Text>
                {durationText ? (
                  <>
                    <Text className="text-white/30 text-[13px]">•</Text>
                    <Text className="text-white/60 text-[13px]">
                      {durationText}
                    </Text>
                  </>
                ) : null}
                {language ? (
                  <>
                    <Text className="text-white/30 text-[13px]">•</Text>
                    <Text className="text-white/60 text-[13px] capitalize">
                      {language}
                    </Text>
                  </>
                ) : null}
              </View>

              {/* Action Bar (Watchlist, Download, Share, Rate) */}
              <View className="flex-row items-center justify-around py-md border-y border-white/10 my-sm">
                <WatchlistButton movie={media} variant="minimal" />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleDownload}
                  className="items-center gap-2"
                >
                  <Ionicons name="download-outline" size={22} color="#FFFFFF" />
                  <Text className="text-xs font-medium text-white/80">
                    Download
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleShare}
                  className="items-center gap-2"
                >
                  <Ionicons name="arrow-redo-outline" size={22} color="#FFFFFF" />
                  <Text className="text-xs font-medium text-white/80">Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
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
            </View>

            {/* Recommendations / Similar Shows */}
            {similarMedia && similarMedia.length > 0 ? (
              <View className="mt-xs">
                <MovieRow
                  title="More Like This"
                  movies={similarMedia}
                  isLoading={similarLoading}
                />
              </View>
            ) : null}
          </ScrollView>
        )}
      </View>

      <PlayerSettingsSheet
        isPresented={settingsSheetVisible}
        onDismiss={() => setSettingsSheetVisible(false)}
        player={player}
        availableQualities={availableQualities}
        selectedQualityId={selectedQualityId}
        onSelectQuality={handleSelectQuality}
      />
    </View>
  );
}
