import { AppImage } from "@/components/common/AppImage";
import { ScreenBackground } from "@/components/home/ScreenBackground";
import {
  usePopularMovies,
  useSearchMovies,
  useTrendingMovies,
  useDiscoverMoviesByGenre,
  useSearchMoviesOnly,
} from "@/queries/movie.queries";
import {
  useTrendingTv,
  useDiscoverTvByGenre,
  useSearchTvOnly,
} from "@/queries/tv.queries";
import { Movie } from "@/types/movie";
import { buildMovieDetailRoute } from "@/utils/movie-navigation";
import { getBackdropUrl, getPosterUrl } from "@/utils/image";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTERS = ["India", "Movies", "Shows", "Action", "Comedy"] as const;
type FilterType = typeof FILTERS[number];

export default function SearchScreen() {
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("India");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 600);
    return () => clearTimeout(handler);
  }, [searchText]);

  const hasQuery = debouncedSearchText.trim().length > 0;

  // Query Hooks
  const trendingHindiMovies = useTrendingMovies("hi");
  const trendingHindiTv = useTrendingTv("hi");
  const trendingMovies = useTrendingMovies(undefined);
  const trendingTv = useTrendingTv(undefined);

  // Genre Discoveries (Action = 28, Comedy = 35)
  const discoverActionMovies = useDiscoverMoviesByGenre(28, selectedFilter === "Action" && !hasQuery);
  const discoverActionTv = useDiscoverTvByGenre(28, selectedFilter === "Action" && !hasQuery);
  const discoverComedyMovies = useDiscoverMoviesByGenre(35, selectedFilter === "Comedy" && !hasQuery);
  const discoverComedyTv = useDiscoverTvByGenre(35, selectedFilter === "Comedy" && !hasQuery);

  // Search Queries
  const searchMulti = useSearchMovies(debouncedSearchText); // for All/India/Action/Comedy
  const searchMoviesOnly = useSearchMoviesOnly(debouncedSearchText, selectedFilter === "Movies");
  const searchTvOnly = useSearchTvOnly(debouncedSearchText, selectedFilter === "Shows");

  // Compute final display list
  const displayList = useMemo(() => {
    let items: Movie[] = [];

    if (hasQuery) {
      if (selectedFilter === "Movies") {
        items = searchMoviesOnly.data || [];
      } else if (selectedFilter === "Shows") {
        items = searchTvOnly.data || [];
      } else {
        // Multi-search results
        items = searchMulti.data || [];

        // Apply filters to multi-search results
        if (selectedFilter === "Action") {
          items = items.filter(
            (item) =>
              item.genre_ids?.includes(28) ||
              item.genres?.some(
                (g) => g.id === 28 || g.name.toLowerCase() === "action"
              )
          );
        } else if (selectedFilter === "Comedy") {
          items = items.filter(
            (item) =>
              item.genre_ids?.includes(35) ||
              item.genres?.some(
                (g) => g.id === 35 || g.name.toLowerCase() === "comedy"
              )
          );
        } else if (selectedFilter === "India") {
          items = items.filter((item) => {
            const lang = item.original_language?.toLowerCase();
            const title = (item.title || item.name || "").toLowerCase();
            return (
              lang === "hi" ||
              lang === "ta" ||
              lang === "te" ||
              lang === "ml" ||
              lang === "kn" ||
              title.includes("(hindi)") ||
              title.includes("(tamil)") ||
              title.includes("(telugu)") ||
              title.includes("(malayalam)") ||
              title.includes("(kannada)")
            );
          });
        }
      }
    } else {
      // Browse mode (no text query)
      switch (selectedFilter) {
        case "India":
          const moviesHi = trendingHindiMovies.data || [];
          const tvHi = trendingHindiTv.data || [];
          // Alternate movies and TV shows
          const maxLength = Math.max(moviesHi.length, tvHi.length);
          for (let k = 0; k < maxLength; k++) {
            if (k < moviesHi.length) items.push(moviesHi[k]);
            if (k < tvHi.length) items.push(tvHi[k]);
          }
          break;
        case "Movies":
          items = trendingMovies.data || [];
          break;
        case "Shows":
          items = trendingTv.data || [];
          break;
        case "Action":
          // Combine discover movies and TV shows for Action
          const actionM = discoverActionMovies.data || [];
          const actionT = discoverActionTv.data || [];
          const actionMax = Math.max(actionM.length, actionT.length);
          for (let k = 0; k < actionMax; k++) {
            if (k < actionM.length) items.push(actionM[k]);
            if (k < actionT.length) items.push(actionT[k]);
          }
          break;
        case "Comedy":
          // Combine discover movies and TV shows for Comedy
          const comedyM = discoverComedyMovies.data || [];
          const comedyT = discoverComedyTv.data || [];
          const comedyMax = Math.max(comedyM.length, comedyT.length);
          for (let k = 0; k < comedyMax; k++) {
            if (k < comedyM.length) items.push(comedyM[k]);
            if (k < comedyT.length) items.push(comedyT[k]);
          }
          break;
      }
    }

    return items;
  }, [
    debouncedSearchText,
    selectedFilter,
    trendingHindiMovies.data,
    trendingHindiTv.data,
    trendingMovies.data,
    trendingTv.data,
    discoverActionMovies.data,
    discoverActionTv.data,
    discoverComedyMovies.data,
    discoverComedyTv.data,
    searchMulti.data,
    searchMoviesOnly.data,
    searchTvOnly.data,
  ]);

  // Overall page loading state
  const isPageLoading = useMemo(() => {
    if (hasQuery) {
      if (selectedFilter === "Movies") return searchMoviesOnly.isLoading;
      if (selectedFilter === "Shows") return searchTvOnly.isLoading;
      return searchMulti.isLoading;
    } else {
      if (selectedFilter === "India") {
        return trendingHindiMovies.isLoading || trendingHindiTv.isLoading;
      }
      if (selectedFilter === "Movies") return trendingMovies.isLoading;
      if (selectedFilter === "Shows") return trendingTv.isLoading;
      if (selectedFilter === "Action") {
        return discoverActionMovies.isLoading || discoverActionTv.isLoading;
      }
      if (selectedFilter === "Comedy") {
        return discoverComedyMovies.isLoading || discoverComedyTv.isLoading;
      }
      return false;
    }
  }, [
    hasQuery,
    selectedFilter,
    trendingHindiMovies.isLoading,
    trendingHindiTv.isLoading,
    trendingMovies.isLoading,
    trendingTv.isLoading,
    discoverActionMovies.isLoading,
    discoverActionTv.isLoading,
    discoverComedyMovies.isLoading,
    discoverComedyTv.isLoading,
    searchMulti.isLoading,
    searchMoviesOnly.isLoading,
    searchTvOnly.isLoading,
  ]);

  // Grid dimensions
  const screenWidth = Dimensions.get("window").width;
  const paddingSide = 16;
  const gap = 8;
  const columnWidth1 = (screenWidth - paddingSide * 2 - gap * 2) / 3;
  const columnWidth2 = columnWidth1 * 2 + gap;
  const rowHeight = columnWidth1 * 1.45;

  // Group items into grid rows to support varying column spans (1 and 2 spans)
  const chunkedRows = useMemo(() => {
    const rows: { items: Movie[]; spans: number[] }[] = [];
    let i = 0;
    while (i < displayList.length) {
      // Dynamic patterns of spanning to match beautiful screenshot layout
      if (i % 7 === 5 && i + 1 < displayList.length) {
        rows.push({
          items: [displayList[i], displayList[i + 1]],
          spans: [2, 1],
        });
        i += 2;
      } else if (i % 7 === 2 && i + 1 < displayList.length) {
        rows.push({
          items: [displayList[i], displayList[i + 1]],
          spans: [1, 2],
        });
        i += 2;
      } else {
        const count = Math.min(3, displayList.length - i);
        rows.push({
          items: displayList.slice(i, i + count),
          spans: Array(count).fill(1),
        });
        i += count;
      }
    }
    return rows;
  }, [displayList]);

  return (
    <View className="flex-1 bg-black">
      <ScreenBackground />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Search Capsule Input */}
        <View className="px-lg py-sm">
          <View className="h-12 flex-row items-center rounded-full bg-white/10 px-lg border border-white/5">
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" style={{ marginRight: 10 }} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Movies, shows and more"
              placeholderTextColor="rgba(255,255,255,0.5)"
              className="flex-1 text-[16px] text-white py-0 font-medium"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            {searchText.length > 0 && (
              <Pressable onPress={() => setSearchText("")} hitSlop={10}>
                <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.6)" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Content Area */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          {/* Section Heading & Filter Category Pills */}
          <View className="px-lg mt-sm mb-md">
            <Text className="text-xl font-bold text-white mb-sm">
              {searchText.trim().length > 0 ? "Search Results" : "Trending in"}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {FILTERS.map((filter) => {
                const isSelected = selectedFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => setSelectedFilter(filter)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 999,
                      backgroundColor: isSelected ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                      borderWidth: 1,
                      borderColor: isSelected ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {filter === "India" && (
                      <Ionicons
                        name="trending-up"
                        size={14}
                        color={isSelected ? "#FFFFFF" : "rgba(255,255,255,0.6)"}
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text
                      style={{
                        color: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                        fontWeight: isSelected ? "700" : "500",
                        fontSize: 14,
                      }}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* List/Grid of Tiles */}
          {isPageLoading ? (
            <View className="py-xl items-center justify-center">
              <ActivityIndicator size="large" color="#0078FF" />
            </View>
          ) : chunkedRows.length === 0 ? (
            <View className="py-xl px-xl items-center justify-center">
              <Ionicons name="film-outline" size={48} color="rgba(255,255,255,0.3)" style={{ marginBottom: 12 }} />
              <Text className="text-white/60 text-center text-md font-semibold">
                {searchText.trim().length > 0
                  ? `No results found for "${searchText}"`
                  : "No items available"}
              </Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: paddingSide, gap: gap }}>
              {chunkedRows.map((row, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: "row", gap: gap, height: rowHeight }}>
                  {row.items.map((movie, colIndex) => {
                    const span = row.spans[colIndex];
                    const width = span === 2 ? columnWidth2 : columnWidth1;
                    const isPremium = movie.vote_average >= 8.0;

                    return (
                      <Link
                        key={movie.id}
                        href={buildMovieDetailRoute(movie, span === 2 ? "backdrop" : "poster")}
                        asChild
                      >
                        <Pressable
                          className="relative overflow-hidden rounded-lg bg-card border border-white/5"
                          style={{
                            width,
                            height: rowHeight,
                          }}
                        >
                          <Link.AppleZoom>
                            <View className="h-full w-full">
                              <AppImage
                                source={{
                                  uri:
                                    span === 2
                                      ? getBackdropUrl(movie.backdrop_path, "w780")
                                      : getPosterUrl(movie.poster_path, "w342"),
                                }}
                                className="h-full w-full"
                              />
                            </View>
                          </Link.AppleZoom>

                          {/* Premium Badge */}
                          {isPremium && (
                            <View className="absolute left-xs top-xs flex-row items-center gap-0.5 rounded bg-premium px-1 py-0.5">
                              <Ionicons name="star" size={9} color="#000000" />
                              <Text className="text-[7px] font-extrabold text-black">GOLD</Text>
                            </View>
                          )}

                          {/* Rating Badge */}
                          {movie.vote_average > 0 && (
                            <View className="absolute bottom-xs right-xs flex-row items-center gap-0.5 rounded bg-black/60 px-[5px] py-0.5">
                              <Ionicons name="star" size={10} color={colors.premium} />
                              <Text className="text-[8px] font-bold text-foreground">
                                {movie.vote_average.toFixed(1)}
                              </Text>
                            </View>
                          )}

                          {/* Subtle text overlay at bottom for accessibility or when poster path is missing */}
                          {(!movie.poster_path && !movie.backdrop_path) && (
                            <View className="absolute inset-x-0 bottom-0 bg-black/60 p-xs">
                              <Text className="text-[10px] text-white font-bold text-center" numberOfLines={2}>
                                {movie.title || movie.name}
                              </Text>
                            </View>
                          )}
                        </Pressable>
                      </Link>
                    );
                  })}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
