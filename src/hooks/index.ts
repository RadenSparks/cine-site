// Re-export all custom hooks from a single location
// This makes imports cleaner: import { useAuth, useMovies } from '@/hooks'

export { useAuth } from './useAuth';
export { useLogout } from './useLogout';
export { useMovies } from './useMovies';
export { useBookings } from './useBookings';
export { useOutsideClick } from './use-outside-click';
