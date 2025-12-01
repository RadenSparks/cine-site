import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

/**
 * ProtectedRoute component that checks if user is authenticated
 * If not authenticated, redirects to auth page
 * Supports USER role users only
 */
export default function ProtectedRoute({ children }: { children: JSX.Element }): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);
  
  // Wait for initialization to complete
  if (!isInitialized) {
    return <div></div>;
  }

  // If no user in Redux state, check localStorage as fallback
  if (!user) {
    const storedUser = localStorage.getItem('cine-user-details');
    if (!storedUser) {
      return <Navigate to="/auth" replace />;
    }
  }
  
  return children;
}