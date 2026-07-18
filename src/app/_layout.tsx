import "../global.css";
import "../nativewind-setup";

import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import * as Sentry from "@sentry/react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Stack, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import { configureReanimatedLogger } from "react-native-reanimated";

// Disable Reanimated strict mode warnings (often triggered by third-party packages like react-native-reanimated-carousel during render)
configureReanimatedLogger({
  strict: false,
});

const isRunningInExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo,
});

Sentry.init({
  dsn:
    process.env.EXPO_PUBLIC_SENTRY_DSN ||
    "https://placeholder-dsn@o0.ingest.sentry.io/0",
  tracesSampleRate: __DEV__ ? 1.0 : 0.1,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo,
});

function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <QueryProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="watch/[id]"
            options={{ headerShown: false, animation: "fade" }}
          />
          <Stack.Screen
            name="settings"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default Sentry.wrap(RootLayout);
