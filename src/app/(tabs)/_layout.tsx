import { Colors } from "@/constants/colors";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const scheme = useColorScheme();
  const isDark = scheme !== "light";
  const colors = isDark ? Colors.dark : Colors.light;

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
