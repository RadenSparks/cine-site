import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return <Navigate to="/auth" replace />; // redirect to unified auth page
  return children;
}