import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

export function CarouselSkeleton() {
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

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.carousel,
          { backgroundColor: colors.card, opacity: pulseAnim },
        ]}
      >
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.textLine1,
              { backgroundColor: colors.border, opacity: pulseAnim },
            ]}
          />
          <Animated.View
            style={[
              styles.textLine2,
              { backgroundColor: colors.border, opacity: pulseAnim },
            ]}
          />
          <View style={styles.buttons}>
            <Animated.View
              style={[
                styles.button,
                { backgroundColor: colors.border, opacity: pulseAnim },
              ]}
            />
            <Animated.View
              style={[
                styles.button,
                { backgroundColor: colors.border, opacity: pulseAnim },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 350,
  },
  carousel: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  textLine1: {
    width: 200,
    height: 28,
    borderRadius: 6,
  },
  textLine2: {
    width: '80%',
    height: 16,
    borderRadius: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  button: {
    width: 100,
    height: 36,
    borderRadius: 6,
  },
});
