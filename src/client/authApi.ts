import { get, post } from './axiosClient';
import { getAuthHeaders } from '../lib/auth';
import type {
  AuthenticationRequestDTO,
  AuthenticationResponseDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
  VerifyRequestDTO,
  VerifyResponseDTO,
  ProfileUpdateRequestDTO,
  ProfileUpdateResponseDTO,
  GetProfileResponseDTO,
  GenreDTO,
  MovieResponseDTO,
  ApiResponseWrapper,
  PaginatedResponse,
} from '../types/auth';

/**
 * Authentication API service
 * Handles all authentication-related API calls
 */

/**
 * Authenticate user with email and password
 * POST /api/v1/authenticate/token
 */
export const authenticateUser = async (
  credentials: AuthenticationRequestDTO
): Promise<AuthenticationResponseDTO> => {
  try {
    const response = await post<{ data: AuthenticationResponseDTO }>(
      '/authenticate/token',
      credentials
    );
    return response.data.data;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
};

/**
 * Register new user
 * POST /api/v1/accounts/register
 */
export const registerUser = async (
  registerData: RegisterRequestDTO
): Promise<RegisterResponseDTO> => {
  try {
    const response = await post<{ data: RegisterResponseDTO }>(
      '/accounts/register',
      registerData
    );
    return response.data.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

/**
 * Verify token validity
 * POST /api/v1/authenticate/verify
 */
export const verifyToken = async (
  verifyData: VerifyRequestDTO
): Promise<VerifyResponseDTO> => {
  try {
    const response = await post<{ data: VerifyResponseDTO }>(
      '/authenticate/verify',
      verifyData
    );
    return response.data.data;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
};

/**
 * Fetch user profile by email
 * GET /api/v1/accounts/details/{email}
 * Optionally accept a token directly instead of reading from localStorage
 */
export const fetchUserProfile = async (
  email: string,
  token?: string
): Promise<GetProfileResponseDTO> => {
  try {
    const headers = token 
      ? { Authorization: `Bearer ${token}` }
      : getAuthHeaders();
    
    const config = {
      headers,
    };
    const response = await get<{ data: GetProfileResponseDTO }>(
      `/accounts/details/${email}`,
      config
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};


/**
 * Update user profile
 * POST /api/v1/accounts/update
 */
export const updateUserProfile = async (
  updateData: ProfileUpdateRequestDTO
): Promise<ProfileUpdateResponseDTO> => {
  try {
    const config = {
      headers: getAuthHeaders(),
    };
    const response = await post<{ data: ProfileUpdateResponseDTO }>(
      '/accounts/update',
      updateData,
      config
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

/**
 * Fetch all genres
 * GET /api/v1/genres
 */
export const fetchAllGenres = async (): Promise<GenreDTO[]> => {
  try {
    const response = await get<ApiResponseWrapper<GenreDTO[]>>(
      '/genres'
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    throw error;
  }
};

/**
 * Fetch all movies with pagination
 * GET /api/v1/movies?page=0&size=10
 */
export const fetchAllMovies = async (
  page: number = 0,
  size: number = 10
): Promise<{ movies: MovieResponseDTO[]; totalPages: number; totalElements: number }> => {
  try {
    const response = await get<ApiResponseWrapper<PaginatedResponse<MovieResponseDTO>>>(
      `/movies?page=${page}&size=${size}`
    );
    const data = response.data.data;
    return {
      movies: data.content || [],
      totalPages: data.totalPages,
      totalElements: data.totalElements,
    };
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    throw error;
  }
};

/**
 * Fetch movie by ID
 * GET /api/v1/movies/{id}
 */
export const fetchMovieById = async (
  id: number
): Promise<MovieResponseDTO> => {
  try {
    const response = await get<ApiResponseWrapper<MovieResponseDTO>>(
      `/movies/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch movie with id ${id}:`, error);
    throw error;
  }
};