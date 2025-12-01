import { useSelector } from 'react-redux';
import { type RootState } from '../store';

interface Movie {
  id: string;
  title: string;
  poster: string;
  description?: string;
  releaseDate?: string;
  genres?: string[];
  duration?: string;
  imdbRating?: number;
  isHot?: boolean;
}

/**
 * Centralized hook for movies-related state and utility functions
 * Single source of truth for movies selectors to avoid scattered useSelector calls
 */
export const useMovies = () => {
  const movies = useSelector((state: RootState) => state.movies.list);
  const isLoading = useSelector((state: RootState) => state.movies.isLoading);

  return {
    // State
    movies,
    isLoading,

    // Utility functions
    getMovieById: (id: string): Movie | undefined => {
      return movies.find((m) => m.id === id);
    },

    getMoviesByGenre: (genre: string): Movie[] => {
      return movies.filter((m) => m.genres?.includes(genre));
    },

    getRelatedMovies: (movieId: string, genres: string[], limit: number = 4): Movie[] => {
      return movies
        .filter(
          (m) =>
            m.id !== movieId &&
            genres.some((genre) => m.genres?.includes(genre))
        )
        .slice(0, limit);
    },

    getHotMovies: (): Movie[] => {
      return movies.filter((m) => m.isHot);
    },

    getMoviesByPage: (page: number, itemsPerPage: number = 12): Movie[] => {
      const start = (page - 1) * itemsPerPage;
      return movies.slice(start, start + itemsPerPage);
    },
  };
};
