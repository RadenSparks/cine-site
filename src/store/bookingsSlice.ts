import { createSlice } from '@reduxjs/toolkit';
// Import type separately if needed
// type PayloadAction is available for TypeScript type checking only
import type { PayloadAction } from '@reduxjs/toolkit';

interface Booking {
  movieId: string;
  seats: number[];
  name: string;
}

const initialState: { list: Booking[] } = {
  list: [],
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    addBooking(state, action: PayloadAction<Booking>) {
      state.list.push(action.payload);
    },
  },
});

export const { addBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;