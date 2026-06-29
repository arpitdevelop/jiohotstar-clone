import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search movies, shows...' }: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View className="mx-lg my-sm h-11 flex-row items-center rounded-lg border border-border bg-card px-md">
      <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        className="flex-1 py-0 text-[15px] text-foreground"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.8}>
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      )}
    </View>
  );
}
