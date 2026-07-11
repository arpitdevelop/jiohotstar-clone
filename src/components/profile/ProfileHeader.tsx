import { AppImage } from '@/components/common/AppImage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

const starIcon = require('@/assets/images/jiohotstar-icon.webp');

export function ProfileHeader() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-lg pb-md pt-sm">
      <AppImage source={starIcon} className="h-7 w-7" contentFit="contain" />

      <Pressable 
        className="flex-row items-center gap-1.5" 
        hitSlop={8}
        onPress={() => router.push('/settings' as any)}
      >
        <Ionicons name="settings-outline" size={18} color="#FFFFFF" />
        <Text className="text-sm font-medium text-white">Help & Settings</Text>
      </Pressable>
    </View>
  );
}
