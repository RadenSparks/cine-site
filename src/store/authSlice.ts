import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: null | { email: string };
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = { email: action.payload.email };
    },
    logout(state) {
      state.user = null;
    },
    register(state, action) {
      state.user = { email: action.payload.email };
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;