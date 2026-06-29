import "react-native";

declare module "react-native" {
  interface ViewStyle {
    experimental_backgroundImage?: string;
  }
}
