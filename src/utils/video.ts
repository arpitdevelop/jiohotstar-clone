import { MediaVideo } from "@/types/video";
import Constants from "expo-constants";

export function pickTrailerVideo(videos: MediaVideo[]): MediaVideo | null {
  const youtubeVideos = videos.filter((video) => video.site === "YouTube");

  const officialTrailer = youtubeVideos.find(
    (video) => video.type === "Trailer" && video.official,
  );
  if (officialTrailer) return officialTrailer;

  const trailer = youtubeVideos.find((video) => video.type === "Trailer");
  if (trailer) return trailer;

  return youtubeVideos[0] ?? null;
}

export function getYouTubeReferer(): string {
  const bundleId =
    Constants.expoConfig?.ios?.bundleIdentifier ??
    Constants.expoConfig?.android?.package ??
    "com.jiohotstarclone.app";

  return `https://${bundleId}`;
}
