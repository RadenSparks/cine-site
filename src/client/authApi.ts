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

