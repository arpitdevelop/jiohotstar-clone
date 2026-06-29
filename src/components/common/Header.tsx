import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppImage } from '@/components/common/AppImage';
import { useRouter } from 'expo-router';
import { useProfileDetails } from '@/queries/profile.queries';

export function Header() {
  const router = useRouter();
  const { data: profile } = useProfileDetails();

  return (
    <View className="h-[60px] flex-row items-center justify-between border-b border-border bg-background px-lg py-sm">
      <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8} className="flex-row items-center">
        <Text className="text-[22px] font-extrabold tracking-tight">
          <Text className="text-jio-blue">Jio</Text>
          <Text className="text-jio-gold">hotstar</Text>
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center gap-md">
        <TouchableOpacity
          className="rounded-md border-[1.5px] border-premium px-2 py-1"
          activeOpacity={0.8}
          onPress={() => router.push('/profile')}
        >
          <Text className="text-[11px] font-bold tracking-wide text-premium">SUBSCRIBE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
          className="h-8 w-8 overflow-hidden rounded-full border border-border"
        >
          <AppImage
            source={{ uri: profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60' }}
            className="h-full w-full"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
