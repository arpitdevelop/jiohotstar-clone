import {
  BROWSE_SECTIONS,
  BrowseSection,
  BrowseTile,
} from "@/constants/browse-categories";
import { HomeCategory } from "@/types/home";
import { BottomSheet, RNHostView } from "@expo/ui";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";

const HORIZONTAL_PADDING = 16;
const TILE_GAP = 8;
const TILE_HEIGHT = 72;
const screenWidth = Dimensions.get("window").width;
const tileWidth = (screenWidth - HORIZONTAL_PADDING * 2 - TILE_GAP * 2) / 3;

interface CategoryBrowseSheetProps {
  isPresented: boolean;
  selectedCategory: HomeCategory;
  onDismiss: () => void;
  onSelectCategory: (category: HomeCategory) => void;
}

function CategoryTile({
  tile,
  isSelected,
  onPress,
}: {
  tile: BrowseTile;
  isSelected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="overflow-hidden rounded-xl"
      style={{
        width: tileWidth,
        height: TILE_HEIGHT,
        experimental_backgroundImage: tile.gradient,
        borderWidth: isSelected ? 2 : 0,
        borderColor: isSelected ? "#FFFFFF" : "transparent",
      }}
    >
      {tile.icon ? (
        <View className="flex-1 justify-end p-2.5">
          <Ionicons name={tile.icon} size={18} color="#FFFFFF" />
          <Text className="mt-1 text-xs font-semibold text-white">
            {tile.label}
          </Text>
        </View>
      ) : (
        <View className="flex-1 justify-end p-2.5">
          {tile.subtitle ? (
            <Text className="text-[10px] text-white/80">{tile.subtitle}</Text>
          ) : null}
          <Text className="text-xs font-semibold text-white">{tile.label}</Text>
        </View>
      )}
    </Pressable>
  );
}

function BrowseSectionGrid({
  section,
  selectedCategory,
  onSelectCategory,
}: {
  section: BrowseSection;
  selectedCategory: HomeCategory;
  onSelectCategory: (category: HomeCategory) => void;
}) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-base font-bold text-white">
        {section.title}
      </Text>
      <View className="flex-row flex-wrap" style={{ gap: TILE_GAP }}>
        {section.items.map((tile) => {
          const isHomeCategory = section.selectable === "homeCategory";
          const isSelected =
            isHomeCategory && selectedCategory === (tile.id as HomeCategory);

          return (
            <CategoryTile
              key={tile.id}
              tile={tile}
              isSelected={isSelected}
              onPress={
                isHomeCategory
                  ? () => onSelectCategory(tile.id as HomeCategory)
                  : undefined
              }
            />
          );
        })}
      </View>
    </View>
  );
}

export function CategoryBrowseSheet({
  isPresented,
  selectedCategory,
  onDismiss,
  onSelectCategory,
}: CategoryBrowseSheetProps) {
  const handleSelectCategory = (category: HomeCategory) => {
    onSelectCategory(category);
    onDismiss();
  };

  return (
    // <Host matchContents style={{ position: "absolute", width: 0, height: 0 }}>
    <BottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      snapPoints={["half"]}
    >
      <RNHostView>
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: HORIZONTAL_PADDING,
            paddingBottom: 32,
          }}
        >
          {BROWSE_SECTIONS.map((section) => (
            <BrowseSectionGrid
              key={section.title}
              section={section}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
          ))}
        </ScrollView>
      </RNHostView>
    </BottomSheet>
    // </Host>
  );
}
