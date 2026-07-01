import {
  BROWSE_SECTIONS,
  BrowseSection,
  BrowseTile,
} from "@/constants/browse-categories";
import { useHomeCategoryStore } from "@/store/home-category.store";
import { HomeCategory } from "@/types/home";
import { BottomSheet, RNHostView } from "@expo/ui";
import { Ionicons } from "@expo/vector-icons";
import { isGlassEffectAPIAvailable } from "expo-glass-effect";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const HORIZONTAL_PADDING = 16;
const TILE_GAP = 8;
const TILE_HEIGHT = 72;
const screenWidth = Dimensions.get("window").width;
const tileWidth = (screenWidth - HORIZONTAL_PADDING * 2 - TILE_GAP * 2) / 3;

interface CategoryBrowseSheetProps {
  isPresented: boolean;
  onDismiss: () => void;
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

function BrowseSectionList({
  section,
  onDismiss,
}: {
  section: BrowseSection;
  onDismiss: () => void;
}) {
  const { category, setCategory, language, setLanguage } =
    useHomeCategoryStore();

  return (
    <View className="mb-6">
      <Text
        className="mb-3 text-base font-bold text-white"
        style={{ paddingHorizontal: HORIZONTAL_PADDING }}
      >
        {section.title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING,
          gap: TILE_GAP,
        }}
      >
        {section.items.map((tile) => {
          const isHomeCategory = section.selectable === "homeCategory";
          const isSelected = isHomeCategory
            ? category === tile.id
            : language === tile.id;

          const handlePress = () => {
            if (isHomeCategory) {
              setCategory(tile.id as HomeCategory);
            } else {
              // Toggle selection: if already selected, clear it
              if (language === tile.id) {
                setLanguage(undefined);
              } else {
                setLanguage(tile.id);
              }
            }
            onDismiss();
          };

          return (
            <CategoryTile
              key={tile.id}
              tile={tile}
              isSelected={isSelected}
              onPress={handlePress}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

function CategoryBrowseSheetAndroid({
  isPresented,
  onDismiss,
}: CategoryBrowseSheetProps) {
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
              style={
                {
                  // backgroundColor: "#09101a",
                }
              }
              contentContainerStyle={{
                paddingBottom: 32,
              }}
            >
              {BROWSE_SECTIONS.map((section: BrowseSection) => (
                <BrowseSectionList
                  key={section.title}
                  section={section}
                  onDismiss={onDismiss}
                />
              ))}
            </ScrollView>
          </RNHostView>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}

function CategoryBrowseSheetGeneric({
  isPresented,
  onDismiss,
}: CategoryBrowseSheetProps) {
  const useGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

  const sheetBackgroundStyle = useGlass
    ? {}
    : {
        // backgroundColor: "#09101a",
      };

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
          style={sheetBackgroundStyle}
          contentContainerStyle={{
            paddingBottom: 32,
          }}
        >
          {BROWSE_SECTIONS.map((section) => (
            <BrowseSectionList
              key={section.title}
              section={section}
              onDismiss={onDismiss}
            />
          ))}
        </ScrollView>
      </RNHostView>
    </BottomSheet>
  );
}

export function CategoryBrowseSheet(props: CategoryBrowseSheetProps) {
  if (Platform.OS === "android") {
    return <CategoryBrowseSheetAndroid {...props} />;
  }
  return <CategoryBrowseSheetGeneric {...props} />;
}
