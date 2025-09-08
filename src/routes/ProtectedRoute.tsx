import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { type RootState } from '../store';
import type { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}