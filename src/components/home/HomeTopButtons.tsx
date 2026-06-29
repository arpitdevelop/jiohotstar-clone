import { AppImage } from "@/components/common/AppImage";
import { Text, View } from "react-native";

const starIcon = require("@/assets/images/jiohotstar-icon.webp");

export function HomeTopButtons() {
  return (
    <View className="flex-row gap-sm px-lg py-sm">
      <View
        className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-[#6b3fa0]/60 py-3.5"
        style={{
          experimental_backgroundImage:
            "linear-gradient(135deg, #0a1628 0%, #1a1040 50%, #2d1b69 100%)",
        }}
      >
        <AppImage source={starIcon} className="h-5 w-5" contentFit="contain" />
        <Text className="text-sm font-bold text-white">JioHotstar</Text>
      </View>

      <View
        className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3.5"
        style={{
          experimental_backgroundImage:
            "linear-gradient(90deg, #e91e8c 0%, #f5a623 100%)",
        }}
      >
        <AppImage source={starIcon} className="h-5 w-5" contentFit="contain" />
        <Text className="text-sm font-extrabold tracking-wide text-white">
          TADKA
        </Text>
      </View>
    </View>
  );
}
