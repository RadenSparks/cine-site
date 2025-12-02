import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch } from '../store';
import { setMoviesLoading, setMoviesLoaded } from '../store/moviesSlice';
import { fetchAllMovies as fetchMoviesFromAPI } from '../client/authApi';
import type { MovieResponseDTO } from '../types/auth';

/**
 * Transform backend MovieResponseDTO to frontend Movie format
 */
function transformMovieFromDTO(movie: MovieResponseDTO) {
  return {
    id: movie.id.toString(),
    title: movie.title,
    poster: movie.poster,
    description: movie.description,
    releaseDate: movie.premiereDate,
    genres: movie.genres?.map((g) => g.name) || [],
    duration: movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : '',
    imdbRating: movie.rating,
    rating: movie.rating,
    isHot: false, // Backend doesn't have this field, can be added later
  };
}

/**
 * Centralized hook for movies-related state and utility functions
 * Single source of truth for movies selectors to avoid scattered useSelector calls
 * Integrates with backend API
 */
export const useMovies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector((state: RootState) => state.movies.list);
  const isLoading = useSelector((state: RootState) => state.movies.isLoading);

  return {
    // State
    movies,
    isLoading,

    // Fetch all movies from backend
    fetchMovies: async (page: number = 0, size: number = 10) => {
      dispatch(setMoviesLoading());
      try {
        const { movies: backendMovies } = await fetchMoviesFromAPI(page, size);
        const transformedMovies = backendMovies.map(transformMovieFromDTO);
        dispatch(setMoviesLoaded(transformedMovies));
        return transformedMovies;
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        dispatch(setMoviesLoading());
        throw error;
      }
    },

    // Utility functions
    getMovieById: (id: string) => {
      return movies.find((m) => m.id === id);
    },

    getMoviesByGenre: (genre: string) => {
      return movies.filter((m) => m.genres?.includes(genre));
    },

    getRelatedMovies: (movieId: string, genres: string[], limit: number = 4) => {
      return movies
        .filter(
          (m) =>
            m.id !== movieId &&
            genres.some((genre) => m.genres?.includes(genre))
        )
        .slice(0, limit);
    },

    getHotMovies: () => {
      return movies.filter((m) => m.isHot);
    },

    getMoviesByPage: (page: number, itemsPerPage: number = 12) => {
      const start = (page - 1) * itemsPerPage;
      return movies.slice(start, start + itemsPerPage);
    },
  };
};
