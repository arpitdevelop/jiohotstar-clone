import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import { useProfileDetails } from '@/queries/profile.queries';

export function Header() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: profile } = useProfileDetails();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8} style={styles.logoContainer}>
        <Text style={styles.logoText}>
          <Text style={styles.jioText}>Jio</Text>
          <Text style={styles.hotstarText}>hotstar</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.rightActions}>
        <TouchableOpacity 
          style={[styles.subscribeButton, { borderColor: colors.premium }]}
          activeOpacity={0.8}
          onPress={() => router.push('/profile')}
        >
          <Text style={[styles.subscribeText, { color: colors.premium }]}>SUBSCRIBE</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
          style={[styles.avatarContainer, { borderColor: colors.border }]}
        >
          <Image 
            source={{ uri: profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60' }} 
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    height: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  jioText: {
    color: '#0078FF', // Jio Brand Blue
  },
  hotstarText: {
    color: '#E2B616', // Hotstar Brand Gold
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  subscribeButton: {
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  subscribeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
