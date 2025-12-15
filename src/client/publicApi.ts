import { get } from './axiosClient';
import type {
  GenreDTO,
  MovieResponseDTO,
  ApiResponseWrapper,
  PaginatedResponse,
} from '../types/auth';

/**
 * Public API service for fetching movies and genres
 * No authentication required - accessible from gateway public routes
 * Gateway routes: GET /api/v1/movies, GET /api/v1/movies/{id}, GET /api/v1/genres
 * 
 * Pagination Details:
 * - page: 0-indexed (first page is 0)
 * - size: number of items per page
 * - Backend response includes: content[], pageable, totalElements, totalPages, last, first
 */

/**
 * Fetch all genres (public endpoint - no auth required)
 * GET /api/v1/genres
 * 
 * @returns Promise<GenreDTO[]> - Array of genre objects
 * @throws Error if request fails
 * 
 * @example
 * const genres = await fetchPublicGenres();
 * // Returns: [{ id: 1, name: "Action" }, { id: 2, name: "Drama" }, ...]
 */
export const fetchPublicGenres = async (): Promise<GenreDTO[]> => {
  try {
    console.log('📡 Fetching public genres from /api/v1/genres');
    const response = await get<ApiResponseWrapper<GenreDTO[]>>(
      '/genres'
    );
    const genres = response.data.data || [];
    console.log(`✅ Genres fetched successfully: ${genres.length} genres`);
    return genres;
  } catch (error) {
    console.error('❌ Failed to fetch public genres:', error);
    return [];
  }
};

/**
 * Fetch all movies with pagination (public endpoint - no auth required)
 * GET /api/v1/movies?page=0&size=10
 * 
 * Backend Response Structure:
 * {
 *   status: "SUCCESS",
 *   data: {
 *     content: [MovieResponseDTO[], ...],
 *     pageable: { pageNumber: 0, pageSize: 10 },
 *     totalElements: 150,
 *     totalPages: 15,
 *     last: false,
 *     first: true
 *   }
 * }
 * 
 * @param page - Page number (0-indexed, default: 0)
 * @param size - Number of items per page (default: 10)
 * @param genreId - Optional genre ID to filter movies (backend filtering)
 * @returns Promise with paginated movies data and pagination metadata
 * @throws Error if request fails
 * 
 * @example
 * const { movies, totalPages, totalElements } = await fetchPublicMovies(0, 10, 1);
 * console.log(`Total movies: ${totalElements}, Pages: ${totalPages}`);
 * console.log(`Current page movies: ${movies.length}`);
 */
export const fetchPublicMovies = async (
  page: number = 0,
  size: number = 10,
  genreId?: number
): Promise<{ 
  movies: MovieResponseDTO[]; 
  totalPages: number; 
  totalElements: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}> => {
  try {
    const genreParam = genreId ? `&genreId=${genreId}` : '';
    console.log(`📡 Fetching public movies - page: ${page}, size: ${size}${genreParam}`);
    const response = await get<ApiResponseWrapper<PaginatedResponse<MovieResponseDTO>>>(
      `/movies?page=${page}&size=${size}${genreParam}`
    );
    
    const data = response.data.data;
    const movies = data.content || [];
    
    console.log(`✅ Movies fetched: ${movies.length}/${data.totalElements} (page ${page + 1}/${data.totalPages})`);
    
    return {
      movies,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      isFirstPage: data.first,
      isLastPage: data.last,
    };
  } catch (error) {
    console.error('❌ Failed to fetch public movies:', error);
    return {
      movies: [],
      totalPages: 0,
      totalElements: 0,
      isFirstPage: true,
      isLastPage: true,
    };
  }
};

/**
 * Fetch single movie by ID (public endpoint - no auth required)
 * GET /api/v1/movies/{id}
 * 
 * @param id - Movie ID (numeric)
 * @returns Promise<MovieResponseDTO> - Full movie details or null if not found
 * @throws Error if request fails
 * 
 * @example
 * const movie = await fetchPublicMovieById(5);
 * if (movie) {
 *   console.log(`${movie.title} (${movie.premiereDate})`);
 *   console.log(`Genres: ${movie.genres.map(g => g.name).join(', ')}`);
 * }
 */
export const fetchPublicMovieById = async (
  id: number
): Promise<MovieResponseDTO | null> => {
  try {
    console.log(`📡 Fetching public movie with ID: ${id}`);
    const response = await get<ApiResponseWrapper<MovieResponseDTO>>(
      `/movies/${id}`
    );
    const movie = response.data.data;
    if (movie) {
      console.log(`✅ Movie fetched: "${movie.title}" (Rating: ${movie.rating}⭐)`);
    } else {
      console.warn(`⚠️ Movie with ID ${id} not found`);
    }
    return movie || null;
  } catch (error) {
    console.error(`❌ Failed to fetch movie with ID ${id}:`, error);
    return null;
  }
};

/**
 * Batch fetch multiple movies by IDs (convenience function)
 * Makes individual requests for each ID (can be optimized with backend batch endpoint)
 * 
 * @param ids - Array of movie IDs to fetch
 * @returns Promise<MovieResponseDTO[]> - Array of successfully fetched movies
 * 
 * @example
 * const movieIds = [1, 2, 3, 4, 5];
 * const movies = await fetchPublicMoviesByIds(movieIds);
 * console.log(`Fetched ${movies.length}/${movieIds.length} movies`);
 */
export const fetchPublicMoviesByIds = async (
  ids: number[]
): Promise<MovieResponseDTO[]> => {
  try {
    console.log(`📡 Fetching ${ids.length} movies by IDs:`, ids);
    const results = await Promise.allSettled(
      ids.map(id => fetchPublicMovieById(id))
    );
    
    const movies = results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => (result.status === 'fulfilled' ? result.value : null))
      .filter((movie): movie is MovieResponseDTO => movie !== null);
    
    console.log(`✅ Fetched ${movies.length}/${ids.length} movies successfully`);
    return movies;
  } catch (error) {
    console.error('❌ Failed to fetch movies by IDs:', error);
    return [];
  }
};

/**
 * Fetch movies by genre name (client-side filtering from paginated results)
 * NOTE: This fetches ALL movies and filters client-side. For large datasets,
 * consider implementing a backend endpoint that filters by genre directly.
 * 
 * @param genreName - Genre name to filter by (case-insensitive)
 * @param page - Page number to start from (default: 0)
 * @param size - Page size (default: 20)
 * @returns Promise<MovieResponseDTO[]> - Movies matching the genre
 * 
 * @example
 * const actionMovies = await fetchPublicMoviesByGenre("Action");
 * console.log(`Found ${actionMovies.length} action movies`);
 */
export const fetchPublicMoviesByGenre = async (
  genreName: string,
  page: number = 0,
  size: number = 20
): Promise<MovieResponseDTO[]> => {
  try {
    console.log(`📡 Fetching movies for genre: "${genreName}"`);
    const { movies } = await fetchPublicMovies(page, size);
    const filtered = movies.filter(movie =>
      movie.genres?.some(g => g.name.toLowerCase() === genreName.toLowerCase())
    );
    console.log(`✅ Found ${filtered.length} movies in genre "${genreName}"`);
    return filtered;
  } catch (error) {
    console.error(`❌ Failed to fetch movies for genre "${genreName}":`, error);
    return [];
  }
};
