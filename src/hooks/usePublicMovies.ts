import { useState, useCallback, useEffect } from 'react';
import {
  fetchPublicGenres,
  fetchPublicMovies,
  fetchPublicMovieById,
  fetchPublicMoviesByGenre,
} from '../client/publicApi';
import type { GenreDTO, MovieResponseDTO } from '../types/auth';

/**
 * Public hook for fetching genres (no authentication required)
 * Auto-fetches on mount, caches in local state
 * 
 * @example
 * const { genres, isLoading, error, refreshGenres } = usePublicGenres();
 */
export const usePublicGenres = () => {
  const [genres, setGenres] = useState<GenreDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPublicGenres();
        setGenres(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load genres';
        setError(message);
        console.error('Genre loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGenres();
  }, []);

  // Get genre by ID
  const getGenreById = useCallback((id: number): GenreDTO | undefined => {
    return genres.find(g => g.id === id);
  }, [genres]);

  // Get genre by name (case-insensitive)
  const getGenreByName = useCallback((name: string): GenreDTO | undefined => {
    return genres.find(g => g.name.toLowerCase() === name.toLowerCase());
  }, [genres]);

  // Manual refresh
  const refreshGenres = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPublicGenres();
      setGenres(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh genres';
      setError(message);
      console.error('Genre refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    genres,
    isLoading,
    error,
    getGenreById,
    getGenreByName,
    refreshGenres,
  };
};

/**
 * Public hook for fetching movies (no authentication required)
 * Stores raw MovieResponseDTO from API - no transformation
 * Does NOT auto-fetch - must call fetchMovies() manually
 * 
 * Features:
 * - Proper pagination support with metadata (totalPages, totalElements, isFirstPage, isLastPage)
 * - Caches movies in local state
 * - Tracks loading and error states
 * - Supports single movie fetch by ID
 * - Supports genre-based filtering (client-side and server-side)
 * - Client-side pagination helper
 * 
 * @example
 * const { movies, isLoading, fetchMovies, totalPages } = usePublicMovies();
 * 
 * useEffect(() => {
 *   fetchMovies(0, 10); // Fetch first page
 * }, []);
 * 
 * // Handle pagination
 * const handleNextPage = () => {
 *   fetchMovies(currentPage + 1, 10);
 * };
 */
export const usePublicMovies = () => {
  const [movies, setMovies] = useState<MovieResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentGenreId, setCurrentGenreId] = useState<number | undefined>(undefined);

  /**
   * Fetch movies with pagination and optional genre filter
   * @param page - 0-indexed page number
   * @param size - Items per page
   * @param genreId - Optional genre ID for backend filtering
   */
  const fetchMovies = useCallback(async (page = 0, size = 10, genreId?: number) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPage(page);
      setPageSize(size);
      setCurrentGenreId(genreId);
      
      const { 
        movies: fetchedMovies, 
        totalPages: pages, 
        totalElements: total,
        isFirstPage: first,
        isLastPage: last
      } = await fetchPublicMovies(page, size, genreId);
      
      setMovies(fetchedMovies);
      setTotalPages(pages);
      setTotalElements(total);
      setIsFirstPage(first);
      setIsLastPage(last);
      
      console.log(`✅ Loaded ${fetchedMovies.length} movies (page ${page + 1}/${pages})`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch movies';
      setError(message);
      console.error('Movie fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch next page of movies
   */
  const fetchNextPage = useCallback(async () => {
    if (!isLastPage) {
      await fetchMovies(currentPage + 1, pageSize, currentGenreId);
    }
  }, [isLastPage, currentPage, pageSize, currentGenreId, fetchMovies]);

  /**
   * Fetch previous page of movies
   */
  const fetchPreviousPage = useCallback(async () => {
    if (!isFirstPage) {
      await fetchMovies(currentPage - 1, pageSize, currentGenreId);
    }
  }, [isFirstPage, currentPage, pageSize, currentGenreId, fetchMovies]);

  /**
   * Jump to specific page
   */
  const goToPage = useCallback(async (page: number) => {
    if (page >= 0 && page < totalPages) {
      await fetchMovies(page, pageSize, currentGenreId);
    }
  }, [totalPages, pageSize, currentGenreId, fetchMovies]);

  /**
   * Get movie by ID from current list
   */
  const getMovieById = useCallback((id: number | string) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    return movies.find(m => m.id === numId);
  }, [movies]);

  /**
   * Fetch single movie by ID from API (not affected by pagination)
   */
  const fetchMovieById = useCallback(async (id: number) => {
    try {
      setError(null);
      const movie = await fetchPublicMovieById(id);
      return movie;
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to fetch movie ${id}`;
      setError(message);
      console.error('Single movie fetch error:', err);
      return null;
    }
  }, []);

  /**
   * Filter movies by genre name from current list (client-side)
   */
  const getMoviesByGenre = useCallback((genreName: string) => {
    return movies.filter(m =>
      m.genres?.some(g => g.name.toLowerCase() === genreName.toLowerCase())
    );
  }, [movies]);

  /**
   * Fetch movies by genre from API
   */
  const fetchMoviesByGenre = useCallback(async (genreName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedMovies = await fetchPublicMoviesByGenre(genreName);
      setMovies(fetchedMovies);
      setTotalPages(1); // Genre filter doesn't have pagination metadata
      setTotalElements(fetchedMovies.length);
      console.log(`✅ Fetched ${fetchedMovies.length} movies in genre "${genreName}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to fetch ${genreName} movies`;
      setError(message);
      console.error('Genre movie fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get movies by page from current list (client-side pagination)
   */
  const getMoviesByPage = useCallback((page: number, pageSize: number = 10) => {
    const start = page * pageSize;
    return movies.slice(start, start + pageSize);
  }, [movies]);

  return {
    // State
    movies,
    isLoading,
    error,
    totalPages,
    totalElements,
    isFirstPage,
    isLastPage,
    currentPage,
    pageSize,

    // Pagination methods
    fetchMovies,
    fetchNextPage,
    fetchPreviousPage,
    goToPage,

    // Single movie methods
    fetchMovieById,
    getMovieById,

    // Genre methods
    getMoviesByGenre,
    fetchMoviesByGenre,

    // Client-side pagination
    getMoviesByPage,
  };
};

/**
 * Combined public hook for movies and genres
 * Useful when you need both data sources together
 * 
 * @example
 * const { genres, movies, isLoading, fetchMovies } = usePublicMoviesAndGenres();
 */
export const usePublicMoviesAndGenres = () => {
  const genresHook = usePublicGenres();
  const moviesHook = usePublicMovies();

  return {
    ...genresHook,
    ...moviesHook,
  };
};

