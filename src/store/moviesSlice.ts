import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    {
      id: '1',
      title: 'Inception',
      poster: 'https://images4.alphacoders.com/112/1122038.jpg',
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
    },
    {
      id: '2',
      title: 'Interstellar',
      poster: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
      description: 'A team of explorers travel through a wormhole in space.',
    },
    {
      id: '3',
      title: 'The Dark Knight',
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      description: 'Batman faces the Joker, a criminal mastermind.',
    },
  ],
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
});

export default moviesSlice.reducer;