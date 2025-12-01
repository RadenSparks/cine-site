import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { addBooking } from '../store/bookingsSlice';

interface Booking {
  movieId: string;
  seats: number[];
  name: string;
}

/**
 * Centralized hook for bookings-related state and actions
 * Single source of truth for bookings selectors to avoid scattered useSelector calls
 */
export const useBookings = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.bookings.list);

  return {
    // State
    bookings,

    // Actions
    addBooking: (booking: Booking) => dispatch(addBooking(booking)),

    // Utility functions
    getBookingsByMovie: (movieId: string): Booking[] => {
      return bookings.filter((b) => b.movieId === movieId);
    },

    getTotalBookings: (): number => {
      return bookings.length;
    },

    getTotalSeatsBooked: (): number => {
      return bookings.reduce((total, booking) => total + booking.seats.length, 0);
    },
  };
};
