import { create } from 'zustand';
import { Movie } from '@/types/movie';

interface WatchlistState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  inWatchlist: (movieId: number) => boolean;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: [],
  addToWatchlist: (movie) => {
    const list = get().watchlist;
    if (list.some((m) => m.id === movie.id)) return;
    set({ watchlist: [movie, ...list] });
  },
  removeFromWatchlist: (movieId) => {
    set({ watchlist: get().watchlist.filter((m) => m.id !== movieId) });
  },
  inWatchlist: (movieId) => {
    return get().watchlist.some((m) => m.id === movieId);
  },
}));
