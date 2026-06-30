import { CategoryBrowseSheet } from "@/components/home/CategoryBrowseSheet";
import { HOME_CATEGORIES } from "@/constants/browse-categories";
import { useHomeCategoryStore } from "@/store/home-category.store";
import { Ionicons } from "@expo/vector-icons";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_HEIGHT = 49;

export function CategoryPillBar() {
  const insets = useSafeAreaInsets();
  const { category: selected, setCategory: setSelected } = useHomeCategoryStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const useGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

  const bottomOffset = insets.bottom + TAB_BAR_HEIGHT + 8;

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
          <View className="overflow-hidden rounded-full border border-white/15 bg-white/10">
            {pillContent}
          </View>
        )}
      </View>

      <CategoryBrowseSheet
        isPresented={isSheetOpen}
        selectedCategory={selected}
        onDismiss={() => setIsSheetOpen(false)}
        onSelectCategory={setSelected}
      />
    </>
  );
}
