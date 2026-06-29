import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export function MovieRowSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const items = Array.from({ length: 4 });

  return (
    <View className="my-md px-lg">
      <Animated.View
        className="mb-md h-5 w-[120px] rounded bg-border"
        style={{ opacity: pulseAnim }}
      />
      <View className="flex-row gap-md">
        {items.map((_, index) => (
          <Animated.View
            key={index}
            className="h-[165px] w-[110px] rounded-lg bg-card"
            style={{ opacity: pulseAnim }}
          />
        ))}
      </View>
    </View>
  );
}
