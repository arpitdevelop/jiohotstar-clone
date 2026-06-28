import { Colors } from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from "react-native";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  // Default to dark for JioHotstar dark cinematic feel
  const isDark = scheme !== "light";

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </>
  );
}
