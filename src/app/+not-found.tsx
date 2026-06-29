import React from 'react';
import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-background p-xl">
        <Text className="mb-md text-xl font-bold text-foreground">This screen doesn't exist.</Text>
        <Link href="/" className="mt-md py-md">
          <Text className="text-sm font-semibold text-accent">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
