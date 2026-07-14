import React, { useEffect, useMemo } from 'react';
import { View, Animated } from 'react-native';

interface MovieRowSkeletonProps {
  type?: 'poster' | 'landscape';
}

export function MovieRowSkeleton({ type = 'poster' }: MovieRowSkeletonProps) {
  const pulseAnim = useMemo(() => new Animated.Value(0.3), []);

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
  const isLandscape = type === 'landscape';
  const width = isLandscape ? 200 : 110;
  const height = isLandscape ? 112 : 165;

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
            className="rounded-lg bg-card"
            style={{
              opacity: pulseAnim,
              width,
              height,
            }}
          />
        ))}
      </View>
    </View>
  );
}
