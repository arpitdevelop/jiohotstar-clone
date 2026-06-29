import { View, ViewStyle } from "react-native";

const horizontalGradient: ViewStyle = {
  experimental_backgroundImage:
    "linear-gradient(to right, rgba(42,132,255,.35), rgba(255,0,140,.25))",
};

const bottomFadeGradient: ViewStyle = {
  experimental_backgroundImage:
    "linear-gradient(to top, #000000, transparent)",
};

export function ScreenBackground() {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      <View className="absolute inset-0" style={horizontalGradient} />
      <View
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "50%", ...bottomFadeGradient }}
      />
    </View>
  );
}
