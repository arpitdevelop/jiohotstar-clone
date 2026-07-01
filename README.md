# JioHotstar Clone

A production-quality mobile streaming app UI clone built with **Expo SDK 56** and **React Native**. The app recreates the look and feel of JioHotstar — dark cinematic theme, **iOS Liquid Glass navigation**, hero carousels, category browsing, search with filters, and rich movie/TV detail screens — powered by live data from [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

A core design goal is **depth through glass**: floating, translucent controls that sit above scrolling content and let backdrop imagery show through — matching modern iOS aesthetics and JioHotstar's premium streaming UI.

---

## Table of Contents

- [Demo](#demo)
- [Liquid Glass UI](#liquid-glass-ui)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [UI & Design Patterns](#ui--design-patterns)
- [Project Structure](#project-structure)
- [Production Practices](#production-practices)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Building for Production](#building-for-production)
- [License](#license)

---

## Demo

### Screen Recordings

> **Coming soon** — iOS and Android screen recordings will be added here.

| Platform | Recording | Notes                                                                                                   |
| -------- | --------- | ------------------------------------------------------------------------------------------------------- |
| iOS      | _TBD_     | **Recommended** — showcases Liquid Glass tab bar, category pill, carousel badges, and bottom sheet blur |
| Android  | _TBD_     | Gradient fallback UI (no native glass; visually equivalent layout)                                      |

### Screenshots

> **Coming soon** — static screenshots can be placed in `assets/readme/` and linked below.

```
assets/readme/
├── ios-home.png
├── ios-search.png
├── ios-detail.png
├── ios-glass-tabbar.png      # Close-up of native glass tab bar
├── ios-glass-pillbar.png     # TV / Movies floating pill with blur
├── ios-glass-carousel.png    # Hero carousel with glass "Newly Added" badge
├── android-home.png
├── android-search.png
└── android-detail.png
```

---

## Liquid Glass UI

iOS uses native Liquid Glass (`expo-glass-effect`, `NativeTabs`, `@expo/ui` BottomSheet) for the tab bar, TV/Movies pill, carousel badges, and browse sheet — content scrolls underneath. Android gets the same layout with gradient fallbacks via `isGlassEffectAPIAvailable()`.

> Record on iOS 26+ to showcase the glass effect in demos.

---

## Features

### Home (`For You`)

- **Featured hero carousel** — auto-playing horizontal stack carousel with backdrop images, **glass "Newly Added" badges** (iOS), quick watchlist toggle, and play CTA
- **Content rows** — Continue Watching, Trending Now, Critically Acclaimed, and Upcoming Releases / On The Air
- **Movies ↔ TV toggle** — switch between movie and TV show catalogs via a **floating glass pill bar** (`CategoryPillBar`) that hovers above the tab bar
- **Language filtering** — browse Hindi, English, Tamil, Telugu, Malayalam, and Kannada content through a bottom sheet with **transparent glass background on iOS**
- **Category browse sheet** — gradient tile grid for content type and language selection (iOS native bottom sheet via `@expo/ui`)
- **Skeleton loading states** — shimmer placeholders while data loads

### Search

- **Debounced search** — 600ms debounce to avoid excessive API calls while typing
- **Filter pills** — India, Movies, Shows, Action, Comedy
- **Dual mode** — browse trending/discover content when idle; live search when query is entered
- **Masonry-style grid** — dynamic 1× and 2× column spans for a editorial layout
- **Premium & rating badges** — GOLD badge for high-rated titles, star ratings on tiles
- **Shared element transitions** — `Link.AppleZoom` (Shared Element) transition for smooth navigation into detail screens (iOS)

### Movie / TV Detail

- **Trailer hero** — YouTube trailer playback via `react-native-youtube-iframe`, with poster-to-video crossfade
- **Rich metadata** — release year, content rating, language, genres, overview
- **Action row** — watchlist, share (native `Share` API), and rate interactions
- **TV show support** — episode list section with mock episode data for series
- **More Like This** — horizontal row of similar titles from TMDB
- **Error & loading states** — dedicated skeleton and fallback UI

### My Space (Profile)

- **User profile header** — avatar, name, subscription info
- **Subscribe banner** — membership upsell with mobile number
- **Multi-profile avatars** — Netflix-style profile picker row (gradient, image, kids, add)
- **Continue Watching** — personalized row using profile name
- **Watchlist section** — persisted in-memory via Zustand, synced across carousel and detail screens
- **Promotional banners** — Jeeto promo and subscription CTAs

### Navigation

- **3-tab layout** — Search, Home, My Space
- **Native Liquid Glass tab bar (iOS)** — `NativeTabs` renders the system glass material with SF Symbols and custom brand icons; content scrolls underneath
- **Floating glass capsule (fallback)** — Android and older iOS get a centered 280px pill with gradient fill and `GlassView` where supported
- **Stack navigation** — detail screens pushed on top of tabs via Expo Router

---

## Tech Stack

| Layer              | Technology                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Framework**      | [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/)                                                                    |
| **Runtime**        | React 19 · React Native 0.85                                                                                              |
| **Routing**        | [Expo Router v6](https://docs.expo.dev/router/introduction/) (file-based, typed routes)                                   |
| **Styling**        | [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for RN) + Tamagui theme tokens                                 |
| **Server State**   | [TanStack React Query v5](https://tanstack.com/query)                                                                     |
| **Client State**   | [Zustand v5](https://zustand.docs.pmnd.rs/)                                                                               |
| **HTTP**           | [Axios](https://axios-http.com/) with request interceptors                                                                |
| **Data Source**    | [TMDB API v3](https://developer.themoviedb.org/docs)                                                                      |
| **Images**         | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)                                                            |
| **Animations**     | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)                                            |
| **Carousel**       | [react-native-reanimated-carousel](https://github.com/dohooo/react-native-reanimated-carousel)                            |
| **Video**          | [react-native-youtube-iframe](https://github.com/LonelyCpp/react-native-youtube-iframe)                                   |
| **Glass UI**       | [expo-glass-effect](https://docs.expo.dev/versions/latest/sdk/glass-effect/) — `GlassView`, `isGlassEffectAPIAvailable()` |
| **Native Tabs**    | [expo-router NativeTabs](https://docs.expo.dev/router/advanced/native-tabs/) — system Liquid Glass tab bar (iOS)          |
| **Native UI**      | [@expo/ui](https://docs.expo.dev/versions/latest/sdk/ui/) (BottomSheet)                                                   |
| **Language**       | TypeScript (strict mode)                                                                                                  |
| **Linting**        | ESLint + `eslint-config-expo`                                                                                             |
| **Build / Deploy** | [EAS Build](https://docs.expo.dev/build/introduction/)                                                                    |

---

## Architecture

The app follows a **layered, feature-oriented** structure that separates concerns and keeps screens thin.

```
┌─────────────────────────────────────────────────────┐
│                    Screens (app/)                    │
│         index · search · profile · movie/[id]        │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Components (components/)                │
│   home · movie · profile · sections · skeleton       │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌────────────┐ ┌─────────────┐
│ queries/     │ │ store/     │ │ hooks/      │
│ React Query  │ │ Zustand    │ │ useTheme    │
│ hooks        │ │            │ │ useDebounce │
└──────┬───────┘ └────────────┘ └─────────────┘
       │
┌──────▼───────────────────────────────────────────┐
│ services/  →  api/axios  →  TMDB REST API         │
│ movie.service · tv.service · video.service        │
└──────────────────────────────────────────────────┘
```

### Data Flow

1. **Screens** call React Query hooks from `queries/`
2. **Query hooks** delegate to **service functions** in `services/`
3. **Services** use the shared **Axios instance** (`api/axios.ts`) with auth interceptors
4. **Services** fall back to local **mock JSON** when no TMDB token is configured
5. **Zustand stores** handle ephemeral client state (watchlist, home category/language)

### API Integration

- Base URL: `https://api.themoviedb.org/3`
- Auth: Bearer token via `EXPO_PUBLIC_TMDB_TOKEN` (injected at build time through EAS or `.env`)
- Endpoints centralized in `api/endpoints.ts`
- Query keys centralized in `queries/queryKeys.ts` for cache invalidation and deduplication
- `staleTime` of 5 minutes for catalog queries, 1 minute for search

---

## UI & Design Patterns

### Visual Identity

- **Dark-first UI** — `userInterfaceStyle: "dark"` with black backgrounds and purple/blue gradient accents
- **Liquid Glass chrome** — floating tab bar, category pill, and carousel badges use native iOS blur where available; see [Liquid Glass UI](#liquid-glass-ui)
- **JioHotstar color palette** — accent blue (`#0078FF`), premium gold (`#E2B616`), glass overlays on dark content
- **ScreenBackground** — reusable gradient layer (horizontal blue→pink wash + bottom fade) on every screen; provides color for glass layers to blur over
- **Typography & spacing** — design tokens in `constants/typography.ts`, `constants/spacing.ts`, and Tailwind theme extensions

### Glass-Aware Layout

Screens that use floating glass controls add extra bottom padding so content is never hidden behind the tab bar + pill bar stack:

- Home `ScrollView`: `contentContainerClassName="pb-[180px]"` — room for glass pill + tab bar
- Search / Profile: `paddingBottom: 140` — same principle

This keeps the glass UI **overlay-only** — it never reflows the page, preserving the floating aesthetic.

### Component Patterns

| Pattern                        | Where Used                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Container / Presentational** | Screens compose dumb components; data fetching lives in screens or query hooks                          |
| **Skeleton placeholders**      | `CarouselSkeleton`, `MovieRowSkeleton`, `MovieDetailSkeleton` mirror final layout                       |
| **Horizontal content rows**    | `MovieRow` + `MovieCard` reused on Home, Profile, and Detail                                            |
| **Floating glass pill bars**   | `CategoryPillBar` — `GlassView` capsule pinned above tab bar; mirrors JioHotstar's TV/Movies switcher   |
| **Glass badges on hero cards** | `FeaturedCarousel` — "Newly Added" pill uses `GlassView` on iOS                                         |
| **Transparent bottom sheet**   | `CategoryBrowseSheet` — iOS sheet background set to `transparent` so system blur shows through          |
| **Native vs. custom tab bar**  | `(tabs)/_layout.tsx` — `NativeTabs` on iOS glass devices, custom `GlassView`/gradient capsule otherwise |
| **Platform-adaptive glass**    | `isGlassEffectAPIAvailable()` gates every `GlassView`; gradient fallback matches shape and position     |
| **Shared element transitions** | `Link.AppleZoom` wraps poster/backdrop images for iOS zoom transitions                                  |
| **Route param hydration**      | `buildMovieDetailRoute()` passes image paths so hero renders instantly before fetch completes           |

### Navigation Structure

```
Stack (_layout)
├── (tabs)
│   ├── search      ← Search tab (left)
│   ├── index       ← Home tab (center)
│   └── profile     ← My Space tab (right)
├── movie/[id]      ← Detail screen (modal-style push)
└── +not-found
```

---

## Project Structure

```
jiohotstar-clone/
├── app.json                  # Expo config (icons, splash, EAS project ID)
├── eas.json                  # EAS Build profiles (dev, preview, production)
├── package.json
├── tailwind.config.js        # NativeWind theme tokens
├── tsconfig.json             # Strict TS + @/* path aliases
│
├── assets/
│   ├── images/               # App icon, splash, tab icons
│   └── expo.icon/            # Expo icon asset
│
└── src/
    ├── app/                  # Expo Router screens
    │   ├── _layout.tsx       # Root providers + stack
    │   ├── +not-found.tsx
    │   ├── (tabs)/
    │   │   ├── _layout.tsx   # Tab bar — NativeTabs (iOS glass) / GlassView capsule (fallback)
    │   │   ├── index.tsx     # Home
    │   │   ├── search.tsx    # Search
    │   │   └── profile.tsx   # My Space
    │   └── movie/
    │       └── [id].tsx      # Movie / TV detail
    │
    ├── api/
    │   ├── axios.ts          # Axios instance
    │   ├── endpoints.ts      # TMDB route constants
    │   └── interceptors.ts   # Auth + error handling
    │
    ├── components/
    │   ├── common/           # AppImage, Header, SearchBar
    │   ├── home/             # CategoryPillBar (glass), CategoryBrowseSheet (transparent sheet), ScreenBackground
    │   ├── movie/            # MovieCard, MediaTrailerHero, WatchlistButton, EpisodeSection
    │   ├── profile/          # ProfileHeader, WatchlistSection, ContinueWatchingRow
    │   ├── sections/         # FeaturedCarousel (glass badges), MovieRow
    │   └── skeleton/         # Loading placeholders
    │
    ├── constants/            # colors, spacing, typography, browse-categories
    ├── hooks/                # useTheme, useDebounce
    ├── mocks/                # movies.json, tv.json (offline fallback)
    ├── providers/            # QueryProvider, ThemeProvider
    ├── queries/              # React Query hooks + queryKeys
    ├── services/             # movie, tv, video service layer
    ├── store/                # Zustand stores (watchlist, home-category)
    ├── theme/                # Tamagui config
    ├── types/                # movie, profile, api, video, home
    └── utils/                # date, duration, image, language, video, navigation
```

---

## Production Practices

### Code Quality

- **TypeScript strict mode** — full type safety across services, queries, and components
- **Path aliases** — `@/` maps to `src/`, `@/assets/` maps to `assets/` for clean imports
- **ESLint** — `eslint-config-expo` for consistent code style (`npm run lint`)
- **Typed routes** — `experiments.typedRoutes: true` in `app.json` for compile-time route safety

### State Management

- **Server state vs. client state separation** — React Query for API data; Zustand only for UI state (watchlist, category filters)
- **Centralized query keys** — predictable cache keys enable targeted invalidation
- **Stale-while-revalidate** — `staleTime` prevents redundant network calls during navigation
- **Conditional fetching** — `enabled` flags on queries (e.g., search only fires when query length > 0)

### Resilience

- **Mock data fallback** — services return local JSON when `EXPO_PUBLIC_TMDB_TOKEN` is missing or API fails
- **Error boundaries at screen level** — detail screen shows retry/back UI on fetch failure
- **Request timeout** — 10s Axios timeout prevents hung requests
- **Single retry** — React Query `retry: 1` for transient failures

### Performance

- **expo-image** — optimized image loading with caching
- **Debounced search** — reduces API load during typing
- **FlatList for rows** — virtualized horizontal lists for content rows
- **Memoized grid computation** — `useMemo` for search grid chunking and display list derivation
- **Skeleton UI** — perceived performance improvement during data fetch

### Security

- **No hardcoded secrets in source** — API token read from `process.env.EXPO_PUBLIC_TMDB_TOKEN`
- **`.env.example`** — documents required env vars without exposing values
- **EAS env injection** — tokens configured per build profile in `eas.json`, not committed to app code

### Platform Adaptation

- **iOS Liquid Glass (primary experience)** — `NativeTabs` system tab bar, `GlassView` on category pill and carousel badges, transparent browse sheet; requires `isGlassEffectAPIAvailable()`
- **Graceful glass fallback** — identical floating layout with `experimental_backgroundImage` gradients and `rgba` fills on Android, web, and older iOS
- **Dual bottom sheet implementations** — iOS `@expo/ui` `BottomSheet` (glass-friendly transparent host) vs Android Jetpack Compose `ModalBottomSheet` (solid `#09101a`)
- **Safe area handling** — `react-native-safe-area-context` on all screens; glass controls offset dynamically based on tab bar height
- **Native share** — uses platform `Share` API on detail screen

### Developer Experience

- **Feature-based folders** — components grouped by domain (home, movie, profile)
- **Single responsibility services** — one service per resource (movie, tv, video)
- **Reusable utilities** — image URL builders, date formatters, navigation helpers
- **EAS Build ready** — development, preview, and production profiles configured

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)
- iOS Simulator (macOS) or Android Emulator
- A [TMDB API Read Access Token](https://developer.themoviedb.org/docs/getting-started)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd jiohotstar-clone

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your TMDB token
```

### Run Locally

```bash
# Start the Expo dev server
npm start

# Or run directly on a platform
npm run ios
npm run android
npm run web
```

The app works without a TMDB token (mock data is used), but live catalog data requires a valid token.

---

## Environment Variables

| Variable                 | Description                            | Required    |
| ------------------------ | -------------------------------------- | ----------- |
| `EXPO_PUBLIC_TMDB_TOKEN` | TMDB API v3 Read Access Token (Bearer) | Recommended |

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_TMDB_TOKEN=your_tmdb_read_access_token_here
```

> Get a free token at [TMDB Settings → API](https://www.themoviedb.org/settings/api).

---

## Scripts

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm start`             | Start Expo dev server                          |
| `npm run ios`           | Build and run on iOS simulator                 |
| `npm run android`       | Build and run on Android emulator              |
| `npm run web`           | Start web dev server                           |
| `npm run lint`          | Run ESLint                                     |
| `npm run reset-project` | Reset to blank Expo template (starter utility) |

---

## Building for Production

This project is configured for [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo
eas login

# Build for iOS / Android
eas build --platform ios --profile production
eas build --platform android --profile production
```

Build profiles are defined in `eas.json`:

- **development** — dev client, internal distribution
- **preview** — internal distribution with TMDB token
- **production** — auto-incrementing version, store-ready

---

## License

See [LICENSE](./LICENSE) for details.
