import { Colors } from "@/constants/colors";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = Colors.dark;
  const useGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

  // Floating offset at the bottom: 8px above safe area on iOS/home indicator devices, 16px on devices with no bottom inset.
  const bottomOffset = insets.bottom > 0 ? insets.bottom + 8 : 16;

  const tabContent = (
    <View className="flex-row items-center justify-around py-2 px-3">
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const iconSrc =
          route.name === "index"
            ? require("@/assets/images/jiohotstar-tab-icon.png")
            : route.name === "profile"
            ? require("@/assets/images/profile-tab-icon.png")
            : null;

        const label =
          route.name === "search"
            ? "Search"
            : route.name === "index"
            ? "Home"
            : "My Space";

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            className="items-center justify-center py-2"
            style={({ pressed }) => ({
              flex: 1,
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            {route.name === "search" ? (
              <Ionicons
                name="search"
                size={24}
                color={isFocused ? colors.tabBarActive : colors.tabBarInactive}
                style={{ opacity: isFocused ? 1 : 0.6 }}
              />
            ) : (
              <Image
                source={iconSrc}
                style={{
                  width: 24,
                  height: 24,
                  opacity: isFocused ? 1 : 0.6,
                }}
                resizeMode="contain"
              />
            )}
            <Text
              className="mt-1 text-[11px]"
              style={{
                color: isFocused ? colors.tabBarActive : colors.tabBarInactive,
                fontWeight: isFocused ? "700" : "500",
                opacity: isFocused ? 1 : 0.7,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View
      style={{
        position: "absolute",
        bottom: bottomOffset,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99,
      }}
      pointerEvents="box-none"
    >
      <View
        style={{
          width: 280,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        {useGlass ? (
          <GlassView
            glassEffectStyle="regular"
            colorScheme="dark"
            isInteractive
            style={{ borderRadius: 999, overflow: "hidden" }}
          >
            {tabContent}
          </GlassView>
        ) : (
          <View
            className="border border-white/15"
            style={{
              backgroundColor: "rgba(13, 14, 18, 0.85)",
              borderRadius: 999,
              experimental_backgroundImage:
                "linear-gradient(to right, rgba(42, 132, 255, 0.22), rgba(255, 0, 140, 0.18))",
            }}
          >
            {tabContent}
          </View>
        )}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const useGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();
  const colors = Colors.dark;

  if (useGlass) {
    return (
      <NativeTabs
        backgroundColor={colors.tabBarBackground}
        iconColor={colors.tabBarInactive}
        labelStyle={{
          default: {
            color: colors.tabBarInactive,
            fontSize: 11,
            fontWeight: "600",
          },
          selected: {
            color: colors.tabBarActive,
            fontSize: 11,
            fontWeight: "700",
          },
        }}
      >
        <NativeTabs.Trigger name="search">
          <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="magnifyingglass" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require("@/assets/images/jiohotstar-tab-icon.png")}
            renderingMode="original"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <NativeTabs.Trigger.Label>My Space</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require("@/assets/images/profile-tab-icon.png")}
            renderingMode="original"
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="search" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

