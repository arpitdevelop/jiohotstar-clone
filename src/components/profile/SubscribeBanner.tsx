import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View, ViewStyle } from 'react-native';

const subscribeGradient: ViewStyle = {
  experimental_backgroundImage: 'linear-gradient(90deg, #0078FF 0%, #e040fb 100%)',
};

interface SubscribeBannerProps {
  mobileNo: string;
}

export function SubscribeBanner({ mobileNo }: SubscribeBannerProps) {
  return (
    <View className="mx-lg mb-lg flex-row items-center justify-between">
      <View className="flex-1 pr-md">
        <Pressable className="mb-1 flex-row items-center gap-1">
          <Text className="text-[15px] font-semibold text-white">
            Subscribe to enjoy JioHotstar
          </Text>
          <Ionicons name="chevron-down" size={14} color="#8F98A6" />
        </Pressable>
        <Text className="text-sm text-muted">{mobileNo}</Text>
      </View>

      <View className="items-center">
        <Pressable
          className="rounded-md px-5 py-2.5"
          style={subscribeGradient}
        >
          <Text className="text-sm font-bold text-white">Subscribe</Text>
        </Pressable>
        <Text className="mt-1.5 text-[11px] text-muted">Plans start at ₹79</Text>
      </View>
    </View>
  );
}
