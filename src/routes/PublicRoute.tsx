import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useAnimation } from "../contexts/AnimationContext";

/**
 * PublicRoute component that checks if user is NOT authenticated
 * If authenticated, redirects to home page
 * This prevents users from accessing auth pages when already logged in
 * 
 * IMPORTANT: Does NOT redirect during auth or logout animation - the animation context prevents it
 */
export default function PublicRoute({ children }: { children: JSX.Element }): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);
  const { isAuthAnimating, isLogoutAnimating } = useAnimation();
  
  // Wait for initialization to complete
  if (!isInitialized) {
    return <div></div>;
  }
  
  // NEVER redirect during auth or logout animation - let the animation handlers control timing
  // This prevents the brief flash of auth page during logout
  if (isAuthAnimating || isLogoutAnimating) {
    console.log('🛡️ PublicRoute: Animation in progress, rendering children');
    return children;
  }
  
  // After logout, user will be null but we need to ensure we don't redirect
  // Only redirect if user is authenticated AND not animating
  // If user is null (post-logout), just render the auth page
  if (!user) {
    console.log('🛡️ PublicRoute: No user, rendering children (auth page)');
    return children;
  }
  
  // User exists and no animation in progress - they should not be on auth page
  if (user.accessToken) {
    console.log('🛡️ PublicRoute: User authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  return children;
}
