const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  bn: "Bengali",
  mr: "Marathi",
  gu: "Gujarati",
  pa: "Punjabi",
  ja: "Japanese",
  ko: "Korean",
  es: "Spanish",
  fr: "French",
  de: "German",
};

export const getLanguageName = (code?: string): string => {
  if (!code) return "English";
  return LANGUAGE_NAMES[code] ?? code.toUpperCase();
};

export const getContentRating = (voteAverage?: number): string => {
  if (!voteAverage) return "U/A 13+";
  if (voteAverage >= 8) return "U/A 7+";
  if (voteAverage >= 6) return "U/A 13+";
  return "A 18+";
};
