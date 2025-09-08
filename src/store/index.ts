import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';
import bookingsReducer from './bookingsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    bookings: bookingsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;