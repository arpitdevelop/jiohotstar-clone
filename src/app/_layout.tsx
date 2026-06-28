import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="movie/[id]"
            options={{
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 400,
            }}
          />
          <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}
