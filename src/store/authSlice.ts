import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/auth';
import { storeUser } from '../lib/auth';

// API endpoint config
const BASE_API = import.meta.env.VITE_API_URL || "http://localhost:17000/api/v1";
const API_URL = `${BASE_API.replace(/\/$/, "")}/users`;

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  verificationStatus: 'idle' | 'pending' | 'verified' | 'invalid';
  isInitialized: boolean;
}

//Thunks

export const fetchUserbyID = createAsyncThunk(
  'auth/fetchUser',
  async (userData: User) => {
    const res = await fetch(`${API_URL}/users/${userData.id}`, { method: 'GET' });
    return await res.json();
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async () => {
    const res = await fetch(`${API_URL}/accounts/register`, { method: 'POST' });
    return await res.json();
  }
);
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: User) => {
    const res = await fetch(`${API_URL}/authenticate/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  }

);

export const updateUserProfile = createAsyncThunk(
  'accounts/update',
  async (data: Partial<User>) => {
    const res = await fetch(`${API_URL}/accounts/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  }

);

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  verificationStatus: 'idle',
  isInitialized: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Login - Set user in state
     */
    login(state, action: PayloadAction<User>) {
      console.log('🔐 Login reducer called with payload:', action.payload);
      state.user = action.payload;
      state.error = null;
      state.loading = false;
      storeUser(state.user);
      console.log('✅ User stored to localStorage:', action.payload);
      console.log('📋 Redux state updated:', state.user);
    },

    /**
     * setUser - Update Redux state WITHOUT storing to localStorage
     * Used during login animation to prevent premature localStorage updates
     * that trigger PublicRoute redirects before animation completes
     */
    setUser(state, action: PayloadAction<User>) {
      console.log('👤 Setting user in Redux (NO localStorage storage):', action.payload);
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    },

    /**
     * Register - Clear state after registration
     */
    register(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
    },

    /**
     * Logout - Clear user session
     */
    logout(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.verificationStatus = 'idle';
      localStorage.removeItem('cine-user-details');
    },

    /**
     * Update Profile - Update user info
     */
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        storeUser(state.user);
      }
    },

    /**
     * Clear any error messages
     */
    clearError(state) {
      state.error = null;
    },

    /**
     * Set error message
     */
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    /**
     * Set verification status manually
     */
    setVerificationStatus(
      state,
      action: PayloadAction<'idle' | 'pending' | 'verified' | 'invalid'>
    ) {
      state.verificationStatus = action.payload;
    },

    /**
     * Set app initialization status
     */
    setInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Login Thunk
    builder.addCase(fetchUserbyID.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserbyID.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      storeUser(state.user);
    });
    builder.addCase(fetchUserbyID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch user';
    });

    // Register Thunk
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Registration failed';
    });
    // Update Profile Thunk
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Update profile failed';
    });
  },
});
export const {
  login,
  setUser,
  register,
  updateProfile,
  logout,
  clearError,
  setError,
  setVerificationStatus,
  setInitialized,
} = authSlice.actions;

export default authSlice.reducer;