import { Colors } from "@/constants/colors";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const scheme = useColorScheme();
  const isDark = scheme !== "light";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <NativeTabs
      blurEffect={
        isDark ? "systemChromeMaterialDark" : "systemChromeMaterialLight"
      }
      backgroundColor="transparent"
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
          src={require("@/assets/images/tabIcons/home.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/explore.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
