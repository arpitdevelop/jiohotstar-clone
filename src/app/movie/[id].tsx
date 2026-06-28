import { CastCard } from "@/components/movie/CastCard";
import { WatchlistButton } from "@/components/movie/WatchlistButton";
import { MovieRow } from "@/components/sections/MovieRow";
import { Spacing } from "@/constants/spacing";
import { useTheme } from "@/hooks/useTheme";
import { useMovieDetails, useSimilarMovies } from "@/queries/movie.queries";
import { getReleaseYear } from "@/utils/date";
import { formatDuration } from "@/utils/duration";
import { getBackdropUrl } from "@/utils/image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const movieId = Number(id);
  const router = useRouter();
  const { colors } = useTheme();

  // Queries
  const { data: movie, isLoading, error } = useMovieDetails(movieId);
  const { data: similarMovies, isLoading: similarLoading } =
    useSimilarMovies(movieId);

  const handleShare = async () => {
    if (!movie) return;
    try {
      await Share.share({
        message: `Check out "${movie.title || movie.name}" on JioHotstar Clone! Overview: ${movie.overview}`,
      });
    } catch (e) {
      console.error("Error sharing:", e);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, marginBottom: Spacing.md }}>
          Failed to load movie details.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.accent }]}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const releaseYear = getReleaseYear(
    movie.release_date || movie.first_air_date,
  );
  const duration = formatDuration(movie.runtime);
  const genresText = movie.genres?.map((g) => g.name).join(" • ") || "";
  const cast = movie.credits?.cast || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Backdrop Image */}
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: getBackdropUrl(movie.backdrop_path, "original") }}
            style={[styles.backdrop, { backgroundColor: colors.card }]}
            resizeMode="cover"
          />
          {/* Overlay gradient simulator */}
          <View style={styles.overlay} />
          <View
            style={[
              styles.gradientBottom,
              { backgroundColor: colors.background },
            ]}
          />

          {/* Floating Back Button */}
          <SafeAreaView style={styles.floatingHeader}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.iconButton,
                { backgroundColor: "rgba(0,0,0,0.5)" },
              ]}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Info Content */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{movie.title || movie.name}</Text>

          {movie.tagline ? (
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              "{movie.tagline}"
            </Text>
          ) : null}

          {/* Metadata Row */}
          <View style={styles.metaRow}>
            <View style={[styles.ratingBadge, { borderColor: colors.border }]}>
              <Ionicons name="star" size={12} color={colors.premium} />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </Text>
            </View>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {releaseYear}
            </Text>
            {movie.runtime ? (
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {duration}
              </Text>
            ) : null}
          </View>

          {genresText ? (
            <Text style={[styles.genresText, { color: colors.textSecondary }]}>
              {genresText}
            </Text>
          ) : null}

          {/* Watch Now Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.playBtn, { backgroundColor: colors.accent }]}
            onPress={() => alert("Playing movie stream...")}
          >
            <Ionicons name="play" size={22} color="#FFFFFF" />
            <Text style={styles.playBtnText}>Watch Now</Text>
          </TouchableOpacity>

          {/* Action Row */}
          <View
            style={[styles.actionRow, { borderBottomColor: colors.border }]}
          >
            <WatchlistButton movie={movie} variant="vertical" />

            <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color={colors.text}
                />
              </View>
              <Text
                style={[styles.actionBtnText, { color: colors.textSecondary }]}
              >
                Share
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => alert("Downloading offline...")}
              style={styles.actionBtn}
            >
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="download-outline"
                  size={20}
                  color={colors.text}
                />
              </View>
              <Text
                style={[styles.actionBtnText, { color: colors.textSecondary }]}
              >
                Download
              </Text>
            </TouchableOpacity>
          </View>

          {/* Overview / Story */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Storyline
            </Text>
            <Text
              style={[styles.overviewText, { color: colors.textSecondary }]}
            >
              {movie.overview}
            </Text>
          </View>

          {/* Cast */}
          {cast.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Cast & Crew
              </Text>
              <FlatList
                data={cast}
                renderItem={({ item }) => <CastCard cast={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.castList}
                ItemSeparatorComponent={() => (
                  <View style={{ width: Spacing.md }} />
                )}
              />
            </View>
          )}

          {/* Similar Movies */}
          {similarMovies && similarMovies.length > 0 && (
            <View style={styles.similarSection}>
              <MovieRow
                title="More Like This"
                movies={similarMovies}
                isLoading={similarLoading}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.xl,
    borderRadius: 6,
  },
  backdropContainer: {
    width: "100%",
    height: 250,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.lg,
    marginTop: Spacing.sm,
  },
  infoContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
  },
  metaText: {
    fontSize: 13,
    fontWeight: "500",
  },
  genresText: {
    fontSize: 12,
    marginBottom: Spacing.lg,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: Spacing.lg,
  },
  playBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    marginBottom: Spacing.lg,
  },
  actionBtn: {
    alignItems: "center",
    gap: 6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: "500",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  overviewText: {
    fontSize: 13,
    lineHeight: 20,
  },
  castList: {
    paddingVertical: Spacing.xs,
  },
  similarSection: {
    marginTop: Spacing.sm,
    marginHorizontal: -Spacing.lg, // negate container padding to span full screen width
  },
});
