import { Colors } from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StatusBar style="light" />
      {children}
    </>
  );
}
