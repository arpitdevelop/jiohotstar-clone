import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Header } from '@/components/common/Header';
import { SearchBar } from '@/components/common/SearchBar';
import { FeaturedCarousel } from '@/components/sections/FeaturedCarousel';
import { MovieRow } from '@/components/sections/MovieRow';
import { MovieCard } from '@/components/movie/MovieCard';
import { CarouselSkeleton } from '@/components/skeleton/CarouselSkeleton';
import { MovieRowSkeleton } from '@/components/skeleton/MovieRowSkeleton';
import {
  useTrendingMovies,
  usePopularMovies,
  useTopRatedMovies,
  useUpcomingMovies,
  useSearchMovies,
} from '@/queries/movie.queries';
import { useDebounce } from '@/hooks/useDebounce';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md * 2) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

export default function HomeScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Queries
  const { data: trending, isLoading: trendingLoading } = useTrendingMovies();
  const { data: popular, isLoading: popularLoading } = usePopularMovies();
  const { data: topRated, isLoading: topRatedLoading } = useTopRatedMovies();
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingMovies();
  
  // Search query (only active if text is entered)
  const { data: searchResults, isLoading: searchLoading } = useSearchMovies(
    debouncedSearchQuery
  );

  const isSearching = debouncedSearchQuery.trim().length > 0;
  const isPageLoading = trendingLoading || popularLoading || topRatedLoading || upcomingLoading;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {isSearching ? (
        <View style={styles.searchResultsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Search Results for "{debouncedSearchQuery}"
          </Text>

          {searchLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : searchResults && searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={({ item }) => (
                <View style={styles.gridItem}>
                  <MovieCard movie={item} width={CARD_WIDTH} height={CARD_HEIGHT} />
                </View>
              )}
              numColumns={3}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.gridContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.center}>
              <Text style={{ color: colors.textSecondary }}>No movies or shows found.</Text>
            </View>
          )}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {isPageLoading ? (
            <View>
              <CarouselSkeleton />
              <MovieRowSkeleton />
              <MovieRowSkeleton />
            </View>
          ) : (
            <View style={styles.sectionsContainer}>
              {trending && <FeaturedCarousel movies={trending.slice(0, 5)} />}

              <MovieRow 
                title="Trending Now" 
                movies={trending} 
                isLoading={trendingLoading} 
              />

              <MovieRow 
                title="Popular Hits" 
                movies={popular} 
                isLoading={popularLoading} 
              />

              <MovieRow 
                title="Critically Acclaimed" 
                movies={topRated} 
                isLoading={topRatedLoading} 
              />

              <MovieRow 
                title="Upcoming Releases" 
                movies={upcoming} 
                isLoading={upcomingLoading} 
              />
              
              <View style={styles.footerSpacer} />
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionsContainer: {
    paddingBottom: Spacing.xl,
  },
  searchResultsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  gridContent: {
    paddingBottom: Spacing.xl,
  },
  gridItem: {
    flex: 1/3,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  footerSpacer: {
    height: 40,
  },
});
