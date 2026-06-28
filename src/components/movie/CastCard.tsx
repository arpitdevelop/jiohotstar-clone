import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CastMember } from '@/types/movie';
import { getProfileUrl } from '@/utils/image';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

interface CastCardProps {
  cast: CastMember;
}

export function CastCard({ cast }: CastCardProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: getProfileUrl(cast.profile_path) }}
        style={[styles.avatar, { backgroundColor: colors.card, borderColor: colors.border }]}
      />
      <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
        {cast.name}
      </Text>
      <Text numberOfLines={1} style={[styles.character, { color: colors.textSecondary }]}>
        {cast.character}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
    gap: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  character: {
    fontSize: 9,
    textAlign: 'center',
    width: '100%',
  },
});
