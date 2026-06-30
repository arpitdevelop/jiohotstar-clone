import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { MovieRowSkeleton } from "./MovieRowSkeleton";

function SkeletonBlock({
  pulseAnim,
  className,
}: {
  pulseAnim: Animated.Value;
  className: string;
}) {
  return (
    <Animated.View className={className} style={{ opacity: pulseAnim }} />
  );
}

export function MovieDetailSkeleton() {
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
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <View>
      <View className="mt-lg items-center px-lg">
        <SkeletonBlock
          pulseAnim={pulseAnim}
          className="mb-sm h-9 w-3/4 rounded-md bg-border"
        />
        <View className="flex-row items-center gap-2">
          <SkeletonBlock
            pulseAnim={pulseAnim}
            className="h-4 w-10 rounded bg-border"
          />
          <SkeletonBlock
            pulseAnim={pulseAnim}
            className="h-4 w-8 rounded bg-border"
          />
          <SkeletonBlock
            pulseAnim={pulseAnim}
            className="h-4 w-16 rounded bg-border"
          />
        </View>
      </View>

      <SkeletonBlock
        pulseAnim={pulseAnim}
        className="mx-lg mt-lg h-12 rounded-full bg-border"
      />

      <SkeletonBlock
        pulseAnim={pulseAnim}
        className="mx-auto mt-lg h-3 w-2/3 rounded bg-border"
      />

      <View className="mt-md gap-2 px-lg">
        <SkeletonBlock
          pulseAnim={pulseAnim}
          className="h-3.5 w-full rounded bg-border"
        />
        <SkeletonBlock
          pulseAnim={pulseAnim}
          className="h-3.5 w-full rounded bg-border"
        />
        <SkeletonBlock
          pulseAnim={pulseAnim}
          className="h-3.5 w-4/5 rounded bg-border"
        />
      </View>

      <View className="mt-lg flex-row justify-center gap-lg px-lg">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock
            key={index}
            pulseAnim={pulseAnim}
            className="h-10 w-10 rounded-full bg-border"
          />
        ))}
      </View>

      <MovieRowSkeleton />
    </View>
  );
}
