import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function ForYouHeader() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-lg pb-sm pt-md">
      <Text className="text-lg font-bold text-white">For You</Text>

      <View className="flex-row items-center gap-md">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/profile')}
          className="rounded-full border border-premium/60 px-3 py-1"
        >
          <Text className="text-xs font-semibold text-premium">Subscribe</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <Ionicons name="tv-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
