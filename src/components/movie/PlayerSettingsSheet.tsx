import { BottomSheet, RNHostView } from "@expo/ui";
import { Ionicons } from "@expo/vector-icons";
import { isGlassEffectAPIAvailable } from "expo-glass-effect";
import { VideoPlayer } from "expo-video";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PlayerSettingsSheetProps {
  isPresented: boolean;
  onDismiss: () => void;
  player: VideoPlayer;
  availableQualities: Array<{
    id: string;
    label: string;
    sub?: string;
    url: string;
  }>;
  selectedQualityId: string;
  onSelectQuality: (opt: any) => void;
}

type TabType = "quality" | "audio" | "subtitles" | "speed";

export function PlayerSettingsSheet(props: PlayerSettingsSheetProps) {
  if (Platform.OS === "android") {
    return <PlayerSettingsSheetAndroid {...props} />;
  }
  return <PlayerSettingsSheetGeneric {...props} />;
}

// Internal sheet content renderer
function PlayerSettingsContent({
  player,
  onDismiss,
  availableQualities,
  selectedQualityId,
  onSelectQuality,
}: {
  player: VideoPlayer;
  onDismiss: () => void;
  availableQualities: Array<{
    id: string;
    label: string;
    sub?: string;
    url: string;
  }>;
  selectedQualityId: string;
  onSelectQuality: (opt: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("quality");

  // Track selection state (fallback to mocks if tracks aren't parsed dynamically yet)
  const [selectedAudioId, setSelectedAudioId] = useState<string>("default");
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<string>("off");

  // Quality options mapping
  const qualityOptions = [
    { id: "auto", label: "Auto", sub: "Recommended for best experience" },
    ...availableQualities.map((track) => ({
      id: track.id,
      label: track.label,
      sub: track.sub,
      url: track.url,
    })),
  ];

  // Audio language options
  const availableAudios = player.availableAudioTracks || [];
  const audioOptions = availableAudios.length
    ? availableAudios.map((track) => ({
        id: track.id || track.language,
        label: track.label || track.language.toUpperCase(),
        track,
      }))
    : [
        { id: "default", label: "English", sub: "Default track" },
        { id: "hi", label: "Hindi" },
        { id: "ta", label: "Tamil" },
        { id: "te", label: "Telugu" },
      ];

  // Subtitle options
  const availableSubtitles = player.availableSubtitleTracks || [];
  const subtitleOptions = [
    { id: "off", label: "Off" },
    ...availableSubtitles.map((track) => ({
      id: track.id || track.language,
      label: track.label,
      track,
    })),
  ];
  // Add mock subtitles if none are loaded
  if (subtitleOptions.length === 1) {
    subtitleOptions.push(
      { id: "en", label: "English" },
      { id: "hi", label: "Hindi" },
    );
  }

  // Playback speeds
  const speedOptions = [
    { label: "0.5x", value: 0.5 },
    { label: "0.75x", value: 0.75 },
    { label: "Normal", value: 1.0 },
    { label: "1.25x", value: 1.25 },
    { label: "1.5x", value: 1.5 },
    { label: "2.0x", value: 2.0 },
  ];

  const handleSelectQuality = async (opt: any) => {
    onSelectQuality(opt);
  };

  const handleSelectAudio = (opt: any) => {
    setSelectedAudioId(opt.id);
    if (opt.track) {
      player.audioTrack = opt.track;
    }
  };

  const handleSelectSubtitle = (opt: any) => {
    setSelectedSubtitleId(opt.id);
    if (opt.id === "off") {
      player.subtitleTrack = null;
    } else if (opt.track) {
      player.subtitleTrack = opt.track;
    }
  };

  const handleSelectSpeed = (value: number) => {
    player.playbackRate = value;
  };

  return (
    <View className="px-lg pt-sm">
      {/* Title Header */}
      <View className="flex-row items-center justify-between pb-md mb-xs">
        <Text className="text-white text-lg font-bold">Settings</Text>
      </View>

      {/* Tabs list row */}
      <View className="flex-row border-b border-white/10 mb-md">
        {(["quality", "audio", "subtitles", "speed"] as TabType[]).map(
          (tab) => {
            const isActive = activeTab === tab;
            const label =
              tab === "quality"
                ? "Quality"
                : tab === "audio"
                  ? "Audio Language"
                  : tab === "subtitles"
                    ? "Subtitles"
                    : "Speed";

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className="mr-lg pb-sm relative"
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isActive ? "text-white" : "text-white/40"
                  }`}
                >
                  {label}
                </Text>
                {isActive && (
                  <View className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                )}
              </TouchableOpacity>
            );
          },
        )}
      </View>

      {/* Settings list container */}
      <View className="pb-xl">
        {activeTab === "quality" &&
          qualityOptions.map((opt) => {
            const isSelected = selectedQualityId === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleSelectQuality(opt)}
                className="flex-row items-center py-sm"
                activeOpacity={0.8}
              >
                <View className="w-8 justify-center">
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color="#1F80E0" />
                  )}
                </View>
                <View className="flex-row items-baseline gap-sm">
                  <Text className="text-white text-sm font-bold">
                    {opt.label}
                  </Text>
                  {opt.sub ? (
                    <Text className="text-white/40 text-xs font-medium">
                      {opt.sub}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}

        {activeTab === "audio" &&
          audioOptions.map((opt: any) => {
            const isSelected = selectedAudioId === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleSelectAudio(opt)}
                className="flex-row items-center py-sm"
                activeOpacity={0.8}
              >
                <View className="w-8 justify-center">
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color="#1F80E0" />
                  )}
                </View>
                <View className="flex-row items-baseline gap-sm">
                  <Text className="text-white text-sm font-bold">
                    {opt.label}
                  </Text>
                  {opt.sub ? (
                    <Text className="text-white/40 text-xs font-medium">
                      {opt.sub}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}

        {activeTab === "subtitles" &&
          subtitleOptions.map((opt: any) => {
            const isSelected = selectedSubtitleId === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleSelectSubtitle(opt)}
                className="flex-row items-center py-sm"
                activeOpacity={0.8}
              >
                <View className="w-8 justify-center">
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color="#1F80E0" />
                  )}
                </View>
                <Text className="text-white text-sm font-bold">
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}

        {activeTab === "speed" &&
          speedOptions.map((opt) => {
            const isSelected = player.playbackRate === opt.value;
            return (
              <TouchableOpacity
                key={opt.label}
                onPress={() => handleSelectSpeed(opt.value)}
                className="flex-row items-center py-sm"
                activeOpacity={0.8}
              >
                <View className="w-8 justify-center">
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color="#1F80E0" />
                  )}
                </View>
                <Text className="text-white text-sm font-bold">
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
}

// iOS and Generic Sheet implementation
function PlayerSettingsSheetGeneric({
  isPresented,
  onDismiss,
  player,
  availableQualities,
  selectedQualityId,
  onSelectQuality,
}: PlayerSettingsSheetProps) {
  const useGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

  return (
    <BottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      snapPoints={["half"]}
    >
      <RNHostView
        style={{
          backgroundColor: useGlass ? "transparent" : "#09101a",
        }}
      >
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 32,
          }}
        >
          <PlayerSettingsContent
            player={player}
            onDismiss={onDismiss}
            availableQualities={availableQualities}
            selectedQualityId={selectedQualityId}
            onSelectQuality={onSelectQuality}
          />
        </ScrollView>
      </RNHostView>
    </BottomSheet>
  );
}

// Android implementation utilizing compose sheets
function PlayerSettingsSheetAndroid({
  isPresented,
  onDismiss,
  player,
  availableQualities,
  selectedQualityId,
  onSelectQuality,
}: PlayerSettingsSheetProps) {
  const {
    ModalBottomSheet,
    Column,
    Host,
  } = require("@expo/ui/jetpack-compose");
  const { padding } = require("@expo/ui/jetpack-compose/modifiers");
  const React = require("react");

  const sheetRef = React.useRef(null);
  const [mount, setMount] = React.useState(isPresented);

  React.useEffect(() => {
    if (isPresented) {
      setMount(true);
      return;
    }
    let cancelled = false;
    sheetRef.current?.hide().then(() => {
      if (!cancelled) setMount(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isPresented]);

  if (!mount) return null;

  const contentModifiers = [padding(16, 0, 16, 0)];

  return (
    <Host style={{ position: "absolute" }} pointerEvents="none">
      <ModalBottomSheet
        ref={sheetRef}
        onDismissRequest={onDismiss}
        showDragHandle={true}
        skipPartiallyExpanded={false}
        containerColor="#09101a"
        scrimColor="rgba(0, 0, 0, 0.5)"
      >
        <Column modifiers={contentModifiers}>
          <RNHostView
            style={{
              backgroundColor: "#09101a",
            }}
          >
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 32,
              }}
            >
              <PlayerSettingsContent
                player={player}
                onDismiss={onDismiss}
                availableQualities={availableQualities}
                selectedQualityId={selectedQualityId}
                onSelectQuality={onSelectQuality}
              />
            </ScrollView>
          </RNHostView>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}
