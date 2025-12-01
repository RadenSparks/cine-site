import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "../pages/home/HomePage";
import { MoviesPage } from "../pages/movies/MoviesPage";
import MovieDetailsPage from "../pages/movies/MovieDetailsPage";
import BookingPage from "../pages/bookings/BookingPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AuthPage from "../pages/auth/AuthPage";
import AccountPage from "../pages/account/AccountPage";
import BookingsPage from "../pages/account/BookingsPage";
import TransactionsPage from "../pages/account/TransactionsPage";
import { login, setInitialized } from "../store/authSlice";
import type { RootState, AppDispatch } from "../store";
import type { User } from "../types/auth";
import { NotificationProvider } from "../contexts/NotificationContext";
import { AnimationProvider, useAnimation } from "../contexts/AnimationContext";
import { LogoutLoader } from "../components/Layout/LogoutLoader";

/**
 * AppRoutes component with localStorage initialization
 * Initializes Redux auth state from localStorage on app mount
 */
function AppRoutesContent() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);

  useEffect(() => {
    // Initialize Redux state from localStorage on app mount
    const storedUserData = localStorage.getItem('cine-user-details');
    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData) as User;
        dispatch(login(user));
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
        localStorage.removeItem('cine-user-details');
      }
    }
    // Mark as initialized
    dispatch(setInitialized(true));
  }, [dispatch]);

  // Show nothing while initializing to prevent flashing
  if (!isInitialized) {
    return <div></div>;
  }

  return (
    <AnimationProvider>
      {/* Global loaders placed inside AnimationProvider so they stay mounted across route changes */}
      <GlobalLoaders />
      <NotificationProvider>
        <BrowserRouter>
        <RouterRoutes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* keep legacy login/signup urls working by redirecting to /auth */}
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/signup" element={<Navigate to="/auth" replace />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </RouterRoutes>
      </BrowserRouter>
      </NotificationProvider>
    </AnimationProvider>
  );
}

function GlobalLoaders() {
  // useAnimation must be called from inside AnimationProvider
  const { isLogoutLoading } = useAnimation();
  
  // Debug logging
  if (isLogoutLoading) {
    console.log('🎬 GlobalLoaders: isLogoutLoading = true, rendering LogoutLoader');
  }
  
  return <LogoutLoader loading={isLogoutLoading} />;
}

export default function AppRoutes() {
  return <AppRoutesContent />;
}