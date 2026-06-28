import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

export function MovieRowSkeleton() {
  const { colors } = useTheme();
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
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.titleSkeleton,
          { backgroundColor: colors.border, opacity: pulseAnim },
        ]}
      />
      <View style={styles.row}>
        {items.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.cardSkeleton,
              { backgroundColor: colors.card, opacity: pulseAnim },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  titleSkeleton: {
    width: 120,
    height: 20,
    borderRadius: 4,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cardSkeleton: {
    width: 110,
    height: 165,
    borderRadius: 8,
  },
});
