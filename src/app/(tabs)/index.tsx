import { CategoryPillBar } from "@/components/home/CategoryPillBar";
import { ForYouHeader } from "@/components/home/ForYouHeader";
import { ScreenBackground } from "@/components/home/ScreenBackground";
import { HomeSectionRenderer } from "@/components/sections/HomeSectionRenderer";
import { CarouselSkeleton } from "@/components/skeleton/CarouselSkeleton";
import { MovieRowSkeleton } from "@/components/skeleton/MovieRowSkeleton";
import { useProfileDetails } from "@/queries/profile.queries";
import { HomeSection, HomeFeedService } from "@/services/home-feed.service";
import { useHomeCategoryStore } from "@/store/home-category.store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const category = useHomeCategoryStore((state) => state.category);
  const language = useHomeCategoryStore((state) => state.language);

  const { data: profile } = useProfileDetails();

  // Infinite Query to fetch sections in pages/batches of 8
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["homeFeedSections", category, language],
    queryFn: ({ pageParam = 0 }) =>
      HomeFeedService.getHomeFeedSections(category, language, pageParam, 8),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 10 * 60 * 1000, // Cache sections structure for 10 minutes
  });

  // Track visibility of sections in the viewport
  const [visibleSectionIds, setVisibleSectionIds] = useState<Record<string, boolean>>({});

  const onViewableItemsChanged = useMemo(() => {
    return ({ viewableItems }: { viewableItems: any[] }) => {
      setVisibleSectionIds((prev) => {
        const next = { ...prev };
        let changed = false;
        viewableItems.forEach((item) => {
          if (item.item && !next[item.item.id]) {
            next[item.item.id] = true;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    };
  }, []);

  const viewabilityConfig = useMemo(() => ({
    viewAreaCoveragePercentThreshold: 0, // Element is "visible" as soon as any part of it hits the viewport
  }), []);

  // Flatten the paginated pages of sections
  const sections = data ? data.pages.flatMap((page) => page.sections) : [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const keyExtractor = useCallback((item: HomeSection) => item.id, []);

  const renderSectionItem = useCallback(
    ({ item }: { item: HomeSection }) => {
      // Dynamic profile-based Title replacement for continueWatching row
      let sectionWithTitle = item;
      if (item.type === "continueWatching" && profile) {
        sectionWithTitle = {
          ...item,
          title: `Continue Watching for ${profile.name}`,
        };
      }

      return (
        <HomeSectionRenderer
          section={sectionWithTitle}
          isVisible={!!visibleSectionIds[item.id]}
          language={language}
        />
      );
    },
    [visibleSectionIds, profile, language]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-md items-center justify-center">
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }, [isFetchingNextPage]);

  // Loading state for initial sections list query
  if (isLoading) {
    return (
      <View className="flex-1 bg-black">
        <ScreenBackground />
        <StatusBar style="light" />
        <SafeAreaView className="flex-1" edges={["top"]}>
          <ForYouHeader />
          <View>
            <CarouselSkeleton />
            <MovieRowSkeleton type="poster" />
            <MovieRowSkeleton type="landscape" />
          </View>
          <CategoryPillBar />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScreenBackground />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <FlatList
          data={sections}
          renderItem={renderSectionItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ForYouHeader}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ pb: 180 }}
          // Performance Optimization props
          windowSize={5}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          removeClippedSubviews={Platform.OS === "android"}
          updateCellsBatchingPeriod={50}
        />
        <CategoryPillBar />
      </SafeAreaView>
    </View>
  );
}
