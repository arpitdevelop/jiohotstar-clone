import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Movie } from '@/types/movie';
import { getBackdropUrl } from '@/utils/image';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { WatchlistButton } from '../movie/WatchlistButton';

const { width } = Dimensions.get('window');

interface FeaturedCarouselProps {
  movies: Movie[];
}

export function FeaturedCarousel({ movies }: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= movies.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, movies]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    setActiveIndex(index);
  };

  const handlePlayPress = (movie: Movie) => {
    router.push({
      pathname: '/movie/[id]',
      params: { id: movie.id },
    });
  };

  const renderItem = ({ item }: { item: Movie }) => {
    return (
      <View style={styles.slide}>
        <Image
          source={{ uri: getBackdropUrl(item.backdrop_path, 'w1280') }}
          style={styles.backdrop}
          resizeMode="cover"
        />
        {/* Soft shadow overlay simulator */}
        <View style={styles.overlay} />
        <View style={[styles.gradientBottom, { backgroundColor: colors.background }]} />

        <View style={styles.contentContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title || item.name}
          </Text>
          <Text numberOfLines={2} style={[styles.overview, { color: colors.textSecondary }]}>
            {item.overview}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handlePlayPress(item)}
              style={[styles.playBtn, { backgroundColor: colors.accent }]}
            >
              <Ionicons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.playBtnText}>Watch Now</Text>
            </TouchableOpacity>

            <WatchlistButton movie={item} variant="vertical" />
          </View>
        </View>
      </View>
    );
  };

  if (movies.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={movies}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id.toString()}
      />
      {/* Pagination indicators */}
      <View style={styles.indicators}>
        {movies.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === activeIndex ? colors.accent : 'rgba(255,255,255,0.4)',
                width: index === activeIndex ? 16 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    width: '100%',
    position: 'relative',
  },
  slide: {
    width: width,
    height: 350,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    opacity: 0.9,
  },
  contentContainer: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  overview: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    gap: 8,
    flex: 1,
    shadowColor: '#0078FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  indicators: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.lg,
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
