import { AppImage } from '@/components/common/AppImage';
import { WatchProfile } from '@/types/profile';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View, ViewStyle } from 'react-native';

const AVATAR_SIZE = 64;

interface ProfileAvatarsRowProps {
  profiles: WatchProfile[];
}

function ProfileAvatar({ profile }: { profile: WatchProfile }) {
  if (profile.variant === 'add') {
    return (
      <View className="h-16 w-16 items-center justify-center rounded-full bg-[#1F2C3F]">
        <Ionicons name="add" size={28} color="#8F98A6" />
      </View>
    );
  }

  if (profile.variant === 'kids') {
    return (
      <View
        className="h-16 w-16 items-center justify-center rounded-full"
        style={{
          experimental_backgroundImage:
            'linear-gradient(135deg, #4a2d8a 0%, #7b3fa0 100%)',
        }}
      >
        <Text className="text-xs font-extrabold tracking-wider text-white">KiDS</Text>
      </View>
    );
  }

  if (profile.variant === 'gradient') {
    const gradientStyle: ViewStyle = {
      experimental_backgroundImage:
        profile.gradient ??
        'linear-gradient(135deg, #0078FF 0%, #00c6ff 100%)',
    };

    return (
      <View
        className="h-16 w-16 items-center justify-center rounded-full"
        style={gradientStyle}
      >
        <View className="h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <View className="mb-0.5 h-1 w-1 rounded-full bg-white" />
          <View className="flex-row gap-2">
            <View className="h-1 w-1 rounded-full bg-white" />
            <View className="h-1 w-1 rounded-full bg-white" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <AppImage
      source={{ uri: profile.avatar }}
      className="h-16 w-16 rounded-full bg-card"
    />
  );
}

export function ProfileAvatarsRow({ profiles }: ProfileAvatarsRowProps) {
  return (
    <View className="mb-lg">
      <View className="mb-md flex-row items-center justify-between px-lg">
        <Text className="text-base font-bold text-white">Profiles</Text>
        <Pressable className="flex-row items-center gap-1" hitSlop={8}>
          <Ionicons name="pencil" size={14} color="#8F98A6" />
          <Text className="text-sm text-muted">Edit</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-lg px-lg"
      >
        {profiles.map((profile) => (
          <Pressable key={profile.id} className="items-center" style={{ width: AVATAR_SIZE }}>
            <View
              className="rounded-full p-0.5"
              style={
                profile.isActive
                  ? { borderWidth: 2, borderColor: '#7b3fa0' }
                  : undefined
              }
            >
              <ProfileAvatar profile={profile} />
            </View>
            <Text
              className="mt-2 text-center text-xs text-white"
              numberOfLines={1}
            >
              {profile.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
