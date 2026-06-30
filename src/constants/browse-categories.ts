import { HomeCategory } from "@/types/home";
import { Ionicons } from "@expo/vector-icons";

export type BrowseTile = {
  id: string;
  label: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  gradient: string;
};

export type BrowseSection = {
  title: string;
  selectable: "homeCategory" | "display";
  items: BrowseTile[];
};

export const HOME_CATEGORIES: HomeCategory[] = ["TV", "Movies"];

export const BROWSE_SECTIONS: BrowseSection[] = [
  {
    title: "Browse",
    selectable: "homeCategory",
    items: [
      {
        id: "TV",
        label: "TV",
        icon: "tv-outline",
        gradient: "linear-gradient(135deg, #0a2e2e 0%, #1a6b6b 100%)",
      },
      {
        id: "Movies",
        label: "Movies",
        icon: "film-outline",
        gradient: "linear-gradient(135deg, #1a1040 0%, #4a2d8a 100%)",
      },
    ],
  },
  {
    title: "Popular Languages",
    selectable: "display",
    items: [
      {
        id: "hi",
        label: "Hindi",
        subtitle: "हिंदी",
        gradient: "linear-gradient(135deg, #3d1a1a 0%, #8b2e2e 100%)",
      },
      {
        id: "en",
        label: "English",
        gradient: "linear-gradient(135deg, #1a2a4a 0%, #2d4a7a 100%)",
      },
      {
        id: "ta",
        label: "Tamil",
        subtitle: "தமிழ்",
        gradient: "linear-gradient(135deg, #1a3d2e 0%, #2d6b4a 100%)",
      },
      {
        id: "te",
        label: "Telugu",
        subtitle: "తెలుగు",
        gradient: "linear-gradient(135deg, #3d2a1a 0%, #6b4a2d 100%)",
      },
      {
        id: "ml",
        label: "Malayalam",
        subtitle: "മലയാളം",
        gradient: "linear-gradient(135deg, #1a3d3d 0%, #2d6b6b 100%)",
      },
      {
        id: "kn",
        label: "Kannada",
        subtitle: "ಕನ್ನಡ",
        gradient: "linear-gradient(135deg, #2a1a3d 0%, #4a2d6b 100%)",
      },
    ],
  },
];
