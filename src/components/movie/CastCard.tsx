import React from 'react';
import { View, Text } from 'react-native';
import { AppImage } from '@/components/common/AppImage';
import { CastMember } from '@/types/movie';
import { getProfileUrl } from '@/utils/image';

interface CastCardProps {
  cast: CastMember;
}

export function CastCard({ cast }: CastCardProps) {
  return (
    <View className="w-20 items-center gap-0.5">
      <AppImage
        source={{ uri: getProfileUrl(cast.profile_path) }}
        className="mb-xs h-[60px] w-[60px] rounded-full border border-border bg-card"
      />
      <Text numberOfLines={1} className="w-full text-center text-[11px] font-semibold text-foreground">
        {cast.name}
      </Text>
      <Text numberOfLines={1} className="w-full text-center text-[9px] text-muted">
        {cast.character}
      </Text>
    </View>
  );
}
