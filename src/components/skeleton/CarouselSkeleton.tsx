import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export function CarouselSkeleton() {
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

  return (
    <View className="h-[350px] w-full">
      <Animated.View
        className="h-full w-full justify-end bg-card"
        style={{ opacity: pulseAnim }}
      >
        <View className="gap-sm p-xl">
          <Animated.View
            className="h-7 w-[200px] rounded-md bg-border"
            style={{ opacity: pulseAnim }}
          />
          <Animated.View
            className="h-4 w-4/5 rounded bg-border"
            style={{ opacity: pulseAnim }}
          />
          <View className="mt-md flex-row gap-md">
            <Animated.View
              className="h-9 w-[100px] rounded-md bg-border"
              style={{ opacity: pulseAnim }}
            />
            <Animated.View
              className="h-9 w-[100px] rounded-md bg-border"
              style={{ opacity: pulseAnim }}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
