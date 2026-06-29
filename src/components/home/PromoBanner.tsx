import React from 'react';
import { View, Text } from 'react-native';

export function PromoBanner() {
  return (
    <View
      className="mx-lg mt-sm items-center justify-center rounded-sm py-2"
      style={{
        experimental_backgroundImage:
          'linear-gradient(90deg, #0078FF 0%, #e040fb 100%)',
      }}
    >
      <Text className="text-xs font-semibold text-white">
        📅 Make the most of your Monthly Free
      </Text>
    </View>
  );
}
