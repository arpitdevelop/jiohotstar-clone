import { AppImage } from "@/components/common/AppImage";
import { ScreenBackground } from "@/components/home/ScreenBackground";
import { Ionicons } from "@expo/vector-icons";
import {
  getAppIconName,
  setAlternateAppIcon,
} from "expo-alternate-app-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sentry from "@sentry/react-native";

interface IconOption {
  id: string | null;
  name: string;
  image: any;
  description: string;
  themeColor: string;
}

const ICON_OPTIONS: IconOption[] = [
  {
    id: null,
    name: "Classic Original",
    image: require("@/assets/app-icons/original-icon.png"),
    description: "The classic JioHotstar brand colors",
    themeColor: "#6B2D8B",
  },
  {
    id: "DarkIcon",
    name: "Midnight Dark",
    image: require("@/assets/app-icons/dark-icon.png"),
    description: "Sleek and deep dark mode aesthetic",
    themeColor: "#0F1017",
  },
  {
    id: "GoldIcon",
    name: "Golden Regal",
    image: require("@/assets/app-icons/gold-icon.png"),
    description: "Premium luxurious golden accents",
    themeColor: "#E2B616",
  },
  {
    id: "HoliIcon",
    name: "Festival Holi",
    image: require("@/assets/app-icons/holi-icon.png"),
    description: "Vibrant splash of festive colors",
    themeColor: "#FF008C",
  },
  {
    id: "DiwaliIcon",
    name: "Diwali Spark",
    image: require("@/assets/app-icons/diwali-icon.png"),
    description: "Celebrate with the light of Diwali",
    themeColor: "#F57C00",
  },
];

function getInitialAppIcon(): string | null {
  try {
    return getAppIconName();
  } catch (error) {
    console.warn("Failed to get active app icon:", error);
    return null;
  }
}

export default function SettingsScreen() {
  const router = useRouter();
  const [activeIcon, setActiveIcon] = useState<string | null>(getInitialAppIcon);
  const [isChanging, setIsChanging] = useState(false);

  const handleIconChange = async (iconId: string | null) => {
    if (activeIcon === iconId) return;

    setIsChanging(true);
    try {
      await setAlternateAppIcon(iconId);
      setActiveIcon(iconId);
      Alert.alert("Success", "App icon updated successfully!");
    } catch (error: any) {
      console.error("Error setting app icon:", error);
      Alert.alert(
        "Platform Error",
        "Could not set the app icon. " + (error?.message || error),
      );
    } finally {
      setIsChanging(false);
    }
  };

  const activeIconDetails =
    ICON_OPTIONS.find((opt) => opt.id === activeIcon) || ICON_OPTIONS[0];

  return (
    <View className="flex-1 bg-black">
      <ScreenBackground />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        {/* Header */}
        <View className="flex-row items-center border-b border-white/10 px-lg py-md">
          <Pressable
            onPress={() => router.back()}
            className="mr-lg rounded-full bg-white/5 p-sm active:bg-white/10"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <View>
            <Text className="text-xl font-bold text-white">
              Help & Settings
            </Text>
            <Text className="text-xs text-muted">Manage your preferences</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-lg py-xl gap-xl"
        >


          {/* App Icon Customization Box */}
          <View className="rounded-2xl border border-white/5 bg-white/5 p-lg">
            <Text className="text-lg font-bold text-white mb-xs">
              App Icon Customization
            </Text>
            <Text className="text-sm text-muted mb-lg">
              Select your preferred app icon for your home screen.
            </Text>

            {/* Current Active Icon Showcase */}
            <View className="flex-row items-center gap-lg rounded-xl bg-white/5 p-md border border-white/5 mb-xl">
              <View
                className="rounded-2xl p-0.5"
                style={{ backgroundColor: activeIconDetails.themeColor }}
              >
                <AppImage
                  source={activeIconDetails.image}
                  className="h-16 w-16 rounded-xl"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Active Icon
                </Text>
                <Text className="text-base font-bold text-white">
                  {activeIconDetails.name}
                </Text>
                <Text className="text-xs text-muted mt-0.5">
                  {activeIconDetails.description}
                </Text>
              </View>
            </View>

            {/* Icons Grid */}
            <View className="flex-row flex-wrap gap-md justify-between">
              {ICON_OPTIONS.map((icon) => {
                const isSelected = activeIcon === icon.id;
                return (
                  <Pressable
                    key={icon.id || "default"}
                    onPress={() => handleIconChange(icon.id)}
                    disabled={isChanging}
                    className={`w-[48%] rounded-xl border p-md items-center transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10"
                        : "border-white/5 bg-white/5 active:bg-white/10"
                    }`}
                  >
                    <View className="relative mb-sm">
                      <AppImage
                        source={icon.image}
                        className="h-16 w-16 rounded-xl"
                      />
                      {isSelected && (
                        <View className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full bg-accent">
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color="#FFFFFF"
                          />
                        </View>
                      )}
                    </View>
                    <Text className="text-sm font-semibold text-white text-center">
                      {icon.name}
                    </Text>
                    <Text
                      className="text-[10px] text-muted text-center mt-xs leading-relaxed"
                      numberOfLines={2}
                    >
                      {icon.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Sentry Diagnostics Box */}
          <View className="rounded-2xl border border-white/5 bg-white/5 p-lg">
            <View className="flex-row items-center gap-sm mb-sm">
              <Ionicons name="bug-outline" size={20} color="#0078FF" />
              <Text className="text-lg font-bold text-white">
                Sentry Diagnostics
              </Text>
            </View>
            <Text className="text-sm text-muted mb-lg">
              Test and verify Sentry crash reporting integration for both JavaScript and native environments.
            </Text>

            {/* Diagnostic Information */}
            <View className="rounded-xl bg-white/5 p-md border border-white/5 gap-sm mb-lg">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted font-semibold uppercase">DSN Status</Text>
                <Text className={`text-xs font-semibold ${process.env.EXPO_PUBLIC_SENTRY_DSN ? 'text-green-400' : 'text-amber-500'}`}>
                  {process.env.EXPO_PUBLIC_SENTRY_DSN ? "Configured" : "Using Placeholder"}
                </Text>
              </View>
              <View className="flex-row justify-between border-t border-white/5 pt-sm">
                <Text className="text-xs text-muted font-semibold uppercase">Environment</Text>
                <Text className="text-xs font-semibold text-white">
                  {__DEV__ ? "Development" : "Production"}
                </Text>
              </View>
            </View>

            {/* Test Actions */}
            <View className="flex-row gap-md justify-between">
              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Throw JS Exception",
                    "This will trigger a JavaScript exception immediately to verify JS error reporting.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Throw",
                        style: "destructive",
                        onPress: () => {
                          throw new Error("Sentry Test JavaScript Error from settings.tsx");
                        }
                      }
                    ]
                  );
                }}
                className="w-[48%] rounded-xl border border-yellow-500/30 bg-yellow-500/10 active:bg-yellow-500/20 p-md items-center"
              >
                <Ionicons name="warning-outline" size={24} color="#EAB308" className="mb-xs" />
                <Text className="text-sm font-semibold text-yellow-500 text-center">
                  JS Exception
                </Text>
                <Text className="text-[10px] text-muted text-center mt-xs leading-relaxed">
                  Throws a test JS exception
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Trigger Native Crash",
                    "This will force a native crash. The app will close instantly. Re-open the app to upload the crash report to Sentry.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Crash App",
                        style: "destructive",
                        onPress: () => {
                          Sentry.nativeCrash();
                        }
                      }
                    ]
                  );
                }}
                className="w-[48%] rounded-xl border border-red-500/30 bg-red-500/10 active:bg-red-500/20 p-md items-center"
              >
                <Ionicons name="flame-outline" size={24} color="#EF4444" className="mb-xs" />
                <Text className="text-sm font-semibold text-red-500 text-center">
                  Native Crash
                </Text>
                <Text className="text-[10px] text-muted text-center mt-xs leading-relaxed">
                  Triggers nativeCrash()
                </Text>
              </Pressable>
            </View>

            <Text className="text-[10px] text-muted mt-md text-center leading-relaxed">
              * Note: Native crashes are sent on the subsequent application startup.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      {isChanging && (
        <View className="absolute inset-0 items-center justify-center bg-black/60">
          <ActivityIndicator size="large" color="#0078FF" />
          <Text className="text-white font-medium mt-md">Applying icon...</Text>
        </View>
      )}
    </View>
  );
}
