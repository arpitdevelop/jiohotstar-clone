import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HomeSection, HomeFeedService } from "@/services/home-feed.service";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { MovieRow } from "./MovieRow";
import { CarouselSkeleton } from "../skeleton/CarouselSkeleton";
import { MovieRowSkeleton } from "../skeleton/MovieRowSkeleton";

interface HomeSectionRendererProps {
  section: HomeSection;
  isVisible: boolean;
  language?: string;
}

export const HomeSectionRenderer = React.memo(function HomeSectionRenderer({
  section,
  isVisible,
  language,
}: HomeSectionRendererProps) {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  // Lazy loading trigger: detect when the section first enters the viewport
  useEffect(() => {
    if (isVisible && !hasBeenVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible, hasBeenVisible]);

  // Section-specific independent data query
  const { data: movies, isLoading } = useQuery({
    queryKey: ["homeSectionData", section.id, section.endpoint, language],
    queryFn: () => HomeFeedService.fetchSectionData(section, language),
    enabled: hasBeenVisible,
    staleTime: 5 * 60 * 1000, // Cache each section's data for 5 minutes
  });

  if (section.type === "hero") {
    if (!hasBeenVisible || isLoading || !movies) {
      return <CarouselSkeleton />;
    }
    return <FeaturedCarousel movies={movies.slice(0, 10)} />;
  }

  // Render Row layout (poster, landscape, continueWatching)
  const isLandscape = section.type === "landscape";
  
  if (!hasBeenVisible || isLoading || !movies) {
    return <MovieRowSkeleton type={isLandscape ? "landscape" : "poster"} />;
  }

  return (
    <MovieRow
      title={section.title}
      movies={movies}
      type={section.type === "landscape" ? "landscape" : section.type === "continueWatching" ? "continueWatching" : "poster"}
    />
  );
});
