import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  login,
  setUser,
  register,
  logout,
  clearError,
  setError,
  updateProfile,
  setVerificationStatus,
} from '../store/authSlice';
import type {
  User,
  AuthenticationRequestDTO,
  RegisterRequestDTO,
  ProfileUpdateRequestDTO,
} from '../types/auth';
import {
  authenticateUser,
  registerUser,
  fetchUserProfile,
  updateUserProfile,
  verifyToken,
} from '../client/authApi';
import { getStoredUser } from '../lib/auth';

/**
 * Centralized hook for authentication-related state and actions
 * Single source of truth for auth selectors and actions
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);
  const verificationStatus = useSelector(
    (state: RootState) => state.auth.verificationStatus
  );
  const isAuthenticated = user !== null;

  return {
    // ============ STATE ============
    user,
    loading,
    error,
    verificationStatus,
    isAuthenticated,

    // ============ ACTIONS ============
    /**
     * Login with user data
     */
    login: (userData: User) =>
      dispatch(login(userData)),

    /**
     * Register new user
     */
    register: () => dispatch(register()),

    /**
     * Update user profile
     */
    updateProfile: (data: Partial<User>) =>
      dispatch(updateProfile(data)),

    /**
     * Logout current user
     */
    logout: () => dispatch(logout()),

    /**
     * Clear error messages
     */
    clearError: () => dispatch(clearError()),

    /**
     * Set error message
     */
    setError: (message: string) => dispatch(setError(message)),

    /**
     * Set verification status
     */
    setVerificationStatus: (status: 'idle' | 'pending' | 'verified' | 'invalid') =>
      dispatch(setVerificationStatus(status)),

    // ============ ASYNC API ACTIONS ============
    /**
     * Authenticate user with email and password
     * POST /api/v1/authenticate/token
     * Automatically fetches full user profile after successful login
     * 
     * NOTE: Uses setUser (no localStorage) to prevent PublicRoute redirect during animation.
     * Passes token directly to fetchUserProfile so it doesn't need localStorage.
     * AuthPage will store to localStorage after animation completes.
     */
    loginAsync: async (credentials: AuthenticationRequestDTO) => {
      try {
        dispatch(setError(''));
        const response = await authenticateUser(credentials);
        
        // Store basic user data with token first (NO LOCALSTORAGE)
        const basicUserData: User = {
          id: response.id,
          email: response.email,
          role: response.role,
          accessToken: response.accessToken,
        };
        // Use setUser to update Redux WITHOUT storing to localStorage
        // This prevents PublicRoute from seeing the user and redirecting
        dispatch(setUser(basicUserData));

        // Fetch full user profile using email
        // Pass token directly so we don't need localStorage
        try {
          const profileData = await fetchUserProfile(response.email, response.accessToken);
          
          // Update with complete user data including profile info
          const fullUserData: User = {
            id: profileData.id,
            name: profileData.name,
            email: profileData.email,
            phoneNumber: profileData.phoneNumber,
            role: profileData.role as 'USER',
            active: profileData.active,
            tierPoint: profileData.tierPoint,
            tier: profileData.tier,
            accessToken: response.accessToken,
          };
          
          // Update Redux with full profile data (still NO localStorage)
          dispatch(updateProfile(fullUserData));
          return fullUserData;
        } catch (profileError) {
          console.warn('Failed to fetch full profile after login, using basic data:', profileError);
          // Return basic data if profile fetch fails, user can still log in
          return basicUserData;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        dispatch(setError(errorMessage));
        throw err;
      }
    },

    /**
     * Register new user
     * POST /api/v1/accounts/register
     */
    registerAsync: async (registerData: RegisterRequestDTO) => {
      try {
        dispatch(setError(''));
        const response = await registerUser(registerData);
        dispatch(register());
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Registration failed';
        dispatch(setError(errorMessage));
        throw err;
      }
    },

    /**
     * Fetch user profile by email
     * GET /api/v1/accounts/details/{email}
     */
    fetchProfile: async () => {
      try {
        dispatch(setError(''));
        const storedUser = getStoredUser();
        if (!storedUser?.email) {
          throw new Error('No user session found');
        }

        const profileData = await fetchUserProfile(storedUser.email);

        const updatedUser: User = {
          ...storedUser,
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber,
          role: profileData.role as 'USER',
          active: profileData.active,
          tierPoint: profileData.tierPoint,
          tier: profileData.tier,
          accessToken: storedUser.accessToken || '',
        };

        dispatch(updateProfile(updatedUser));
        return profileData;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
        dispatch(setError(errorMessage));
        throw err;
      }
    },

    /**
     * Update user profile
     * POST /api/v1/accounts/update
     */
    updateProfileAsync: async (updateData: ProfileUpdateRequestDTO) => {
      try {
        dispatch(setError(''));
        const response = await updateUserProfile(updateData);

        const storedUser = getStoredUser();
        const updatedUser: User = {
          ...storedUser,
          id: response.id,
          name: response.name,
          email: response.email,
          phoneNumber: response.phoneNumber,
          password : response.password,
          role: response.role as 'USER',
          active: response.active,
          tierPoint: response.tierPoint,
          accessToken: storedUser?.accessToken || '',
        };

        dispatch(updateProfile(updatedUser));
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
        dispatch(setError(errorMessage));
        throw err;
      }
    },

    /**
     * Verify token validity
     * POST /api/v1/authenticate/verify
     */
    verifyTokenAsync: async (token: string) => {
      try {
        dispatch(setVerificationStatus('pending'));
        const response = await verifyToken({ token });
        if (response.valid) {
          dispatch(setVerificationStatus('verified'));
        } else {
          dispatch(setVerificationStatus('invalid'));
        }
        return response;
      } catch (err) {
        dispatch(setVerificationStatus('invalid'));
        throw err;
      }
    },

    /**
     * Logout user
     * Clears Redux state and localStorage
     * NOTE: This is a synchronous logout reducer call
     * The actual animation/navigation is handled by components that call this
     */
    logoutAsync: async () => {
      try {
        dispatch(setError(''));
        // Call logout reducer to clear state and localStorage
        dispatch(logout());
        console.log('✅ Logout completed - user cleared from Redux and localStorage');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Logout failed';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
  };
};

