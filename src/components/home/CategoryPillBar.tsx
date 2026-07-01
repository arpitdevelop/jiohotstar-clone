import { CategoryBrowseSheet } from "@/components/home/CategoryBrowseSheet";
import { HOME_CATEGORIES } from "@/constants/browse-categories";
import { useHomeCategoryStore } from "@/store/home-category.store";
import { Ionicons } from "@expo/vector-icons";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_HEIGHT = 64;

const LANGUAGE_NAMES: Record<string, string> = {
  hi: "Hindi",
  en: "English",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
};

export function CategoryPillBar() {
  const insets = useSafeAreaInsets();
  const {
    category: selected,
    setCategory: setSelected,
    language,
    setLanguage,
  } = useHomeCategoryStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const useGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

  const tabBarHeight = useGlass ? 49 : TAB_BAR_HEIGHT;
  const bottomOffset = useGlass ? insets.bottom + 8 : insets.bottom + 85;

  const pillContent = (
    <View className="flex-row items-center px-5 py-2.5">
      {HOME_CATEGORIES.map((category, index) => (
        <React.Fragment key={category}>
          {index > 0 && <View className="mx-3 h-3 w-px bg-white/25" />}
          <Pressable
            onPress={() => setSelected(category)}
            hitSlop={8}
            className="px-1"
          >
            <Text
              className={`text-sm ${
                selected === category
                  ? "font-semibold text-white"
                  : "font-medium text-white/65"
              }`}
            >
              {category}
            </Text>
          </Pressable>
        </React.Fragment>
      ))}

      {language && LANGUAGE_NAMES[language] ? (
        <>
          <View className="mx-3 h-3 w-px bg-white/25" />
          <Pressable
            onPress={() => setLanguage(undefined)}
            hitSlop={8}
            className="px-1 flex-row items-center"
          >
            <Text className="text-sm font-semibold text-white mr-1">
              {LANGUAGE_NAMES[language]}
            </Text>
            <Ionicons
              name="close-circle"
              size={14}
              color="rgba(255,255,255,0.6)"
            />
          </Pressable>
        </>
      ) : null}

      <View className="mx-3 h-3 w-px bg-white/25" />
      <Pressable
        hitSlop={8}
        className="px-0.5"
        onPress={() => setIsSheetOpen(true)}
      >
        <Ionicons name="chevron-up" size={14} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  return (
    <>
      <View
        className="absolute left-0 right-0 items-center"
        style={{ bottom: bottomOffset }}
        pointerEvents="box-none"
      >
        {useGlass ? (
          <GlassView
            glassEffectStyle="regular"
            colorScheme="dark"
            isInteractive
            style={{ borderRadius: 999, overflow: "hidden" }}
          >
            {pillContent}
          </GlassView>
        ) : (
          <View
            className="overflow-hidden rounded-full border border-white/15"
            style={{
              backgroundColor: "#0d0e12",
              experimental_backgroundImage:
                "linear-gradient(to right, rgba(42, 132, 255, 0.22), rgba(255, 0, 140, 0.18))",
            }}
          >
            {pillContent}
          </View>
        )}
      </View>

      <CategoryBrowseSheet
        isPresented={isSheetOpen}
        onDismiss={() => setIsSheetOpen(false)}
      />
    </>
  );
}
