import { useCallback, useState, useEffect } from 'react';
import { fetchAllGenres as fetchGenresFromAPI } from '../client/authApi';
import type { GenreDTO } from '../types/auth';

/**
 * Centralized hook for genres-related state and utility functions
 * Fetches genres from backend API
 */
export const useGenres = () => {
  const [genres, setGenres] = useState<GenreDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchGenresFromAPI();
        setGenres(data);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch genres');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Get genre by ID
  const getGenreById = useCallback((id: number): GenreDTO | undefined => {
    return genres.find((g) => g.id === id);
  }, [genres]);

  // Get genre by name
  const getGenreByName = useCallback((name: string): GenreDTO | undefined => {
    return genres.find((g) => g.name.toLowerCase() === name.toLowerCase());
  }, [genres]);

  // Refresh genres
  const refreshGenres = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchGenresFromAPI();
      setGenres(data);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch genres');
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
