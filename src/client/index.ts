/**
 * API Client exports
 * Organized by access level: authentication-based vs public
 */

// Authentication-based API calls (requires JWT token)
export {
  authenticateUser,
  registerUser,
  verifyToken,
  fetchUserProfile,
  updateUserProfile,
  fetchAllGenres,
  fetchAllMovies,
  fetchMovieById,
} from './authApi';

// Public API calls (no authentication required)
export {
  fetchPublicGenres,
  fetchPublicMovies,
  fetchPublicMovieById,
  fetchPublicMoviesByIds,
  fetchPublicMoviesByGenre,
} from './publicApi';
