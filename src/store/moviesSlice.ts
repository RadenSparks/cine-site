import { createSlice } from '@reduxjs/toolkit';

interface Movie {
  id: string;
  title: string;
  poster: string;
  description?: string;
  releaseDate?: string;
  genres?: string[];
  duration?: string;
  imdbRating?: number;
  isHot?: boolean;
  video?: string;
}

interface MoviesState {
  list: Movie[];
  isLoading: boolean;
}

const initialState: MoviesState = {
  isLoading: false,
  list: [],
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMoviesLoading: (state) => {
      state.isLoading = true;
    },
    setMoviesLoaded: (state, action) => {
      state.isLoading = false;
      state.list = action.payload;
    },
  },
});

export const { setMoviesLoading, setMoviesLoaded } = moviesSlice.actions;
export default moviesSlice.reducer;