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
  list: [
    // ...existing 15 movies...
    {
      id: "1",
      title: "Pacific Rim",
      poster: "https://xl.movieposterdb.com/13_08/2013/1663662/xl_1663662_2845b9a6.jpg?v=2024-12-04%2021:28:23",
      description: "When legions of Kaiju rise from the sea, humanity fights back with giant robots piloted in pairs.",
      releaseDate: "2025-09-20",
      genres: ["Action", "Sci-Fi", "Adventure"],
      duration: "2h 11m",
      imdbRating: 7.0,
      video: "https://www.youtube.com/embed/5guMumPFIWQ"
    },
    {
      id: "2",
      title: "Into The Spider-Verse",
      poster: "https://xl.movieposterdb.com/22_10/2018/4633694/xl_spider-man-into-the-spider-verse-movie-poster_a7f62b30.jpeg?v=2025-10-06%2003:38:07",
      description: "Miles Morales teams up with Spider-people from other dimensions to save the multiverse.",
      releaseDate: "2025-09-23",
      genres: ["Animation", "Action", "Adventure"],
      duration: "2h 21m",
      imdbRating: 8.4,
      video: "https://www.youtube.com/embed/g4Hbz2jV3KE"
    },
    {
      id: "3",
      title: "Thunderbolts",
      poster: "https://xl.movieposterdb.com/25_04/2025/20969586/xl_thunderbolts-movie-poster_31856c6e.jpg?v=2025-08-28%2020:27:02",
      description: "A team of anti-heroes undertake missions that require morally flexible methods.",
      releaseDate: "2025-09-25",
      genres: ["Action", "Thriller", "Crime"],
      duration: "1h 54m",
      imdbRating: 7.8,
      video: "https://www.youtube.com/embed/WYHKoK1K8yc"
    },
    {
      id: "4",
      title: "Avatar: The Way of Water",
      poster: "https://xl.movieposterdb.com/23_09/2022/1630029/xl_avatar-the-way-of-water-movie-poster_614883c4.jpg?v=2025-07-11%2013:53:24",
      description: "Jake Sully and his family fight to stay together on Pandora.",
      releaseDate: "2025-09-28",
      genres: ["Adventure", "Fantasy", "Sci-Fi"],
      duration: "3h 12m",
      imdbRating: 7.9,
      video: "https://www.youtube.com/embed/d9MyW72EhRE"
    },
    {
      id: "5",
      title: "How to Train Your Dragon: Live Action",
      poster: "https://xl.movieposterdb.com/25_06/2025/26743210/xl_how-to-train-your-dragon-movie-poster_1cd1e772.jpg?v=2025-07-19%2001:42:02",
      description: "Live-action adaptation about a young Viking who befriends a dragon.",
      releaseDate: "2025-10-01",
      genres: ["Family", "Adventure", "Fantasy"],
      duration: "2h 18m",
      imdbRating: 8.1,
      video: "https://www.youtube.com/embed/jbF6V6H8dN4"
    },
    {
      id: "6",
      title: "Just Like Heaven",
      poster: "https://xl.movieposterdb.com/05_11/2005/0425123/xl_64709_0425123_1ae81faf.jpg?v=2023-01-16%2022:41:26",
      description: "A man falls in love with the spirit of a woman living in his apartment.",
      releaseDate: "2025-09-10",
      genres: ["Romance", "Comedy", "Fantasy"],
      duration: "1h 38m",
      imdbRating: 6.8,
      video: "https://www.youtube.com/embed/pSLlmrB6R8E"
    },
    {
      id: "7",
      title: "Tick, Tick... Boom!",
      poster: "https://image.tmdb.org/t/p/original/DPmfcuR8fh8ROYXgdjrAjSGA0o.jpg",
      description: "A struggling composer navigates love, friendship, and the pressures of life.",
      releaseDate: "2025-09-24",
      genres: ["Drama", "Musical", "Biography"],
      duration: "2h 3m",
      imdbRating: 7.4,
      video: "https://www.youtube.com/embed/ckvkMZQB4Qo"
    },
    {
      id: "8",
      title: "The Social Network",
      poster: "https://xl.movieposterdb.com/11_06/2010/1285016/xl_1285016_6a84335f.jpg?v=2022-08-15%2019:28:13",
      description: "The story behind the founding of Facebook and the fallout that followed.",
      releaseDate: "2010-10-01",
      genres: ["Drama", "Biography"],
      duration: "2h 0m",
      imdbRating: 7.7,
      video: "https://www.youtube.com/embed/Fc1P-AEaecg"
    },
    {
      id: "9",
      title: "Inception",
      poster: "https://xl.movieposterdb.com/10_06/2010/1375666/xl_1375666_07030c72.jpg?v=2025-10-05%2011:02:41",
      description: "A thief uses dream-sharing technology to plant an idea into a CEO's mind.",
      releaseDate: "2010-07-16",
      genres: ["Action", "Sci-Fi", "Thriller"],
      duration: "2h 28m",
      imdbRating: 8.8,
      video: "https://www.youtube.com/embed/YoHD9XEInc0"
    },
    {
      id: "10",
      title: "The Matrix Resurrections",
      poster: "https://xl.movieposterdb.com/22_01/2021/10838180/xl_10838180_e925675f.jpg?v=2022-01-25%2015:20:22",
      description: "Neo returns to the Matrix to confront his past and new threats.",
      releaseDate: "2021-12-22",
      genres: ["Action", "Sci-Fi"],
      duration: "2h 28m",
      imdbRating: 5.7,
      video: "https://www.youtube.com/embed/vKQi3bBA1y8"
    },
    {
      id: "11",
      title: "Dune",
      poster: "https://xl.movieposterdb.com/21_09/2021/1160419/xl_1160419_f865cf40.jpg?v=2025-07-08%2018:49:19",
      description: "A noble family is drawn into a war for control of the galaxy's most valuable asset.",
      releaseDate: "2021-10-22",
      genres: ["Adventure", "Drama", "Sci-Fi"],
      duration: "2h 42m",
      imdbRating: 8.0,
      video: "https://www.youtube.com/embed/n9xhJsXwYL0"
    },
    {
      id: "12",
      title: "Shang-Chi and the Legend of the Ten Rings",
      poster: "https://xl.movieposterdb.com/24_11/2021/9376612/xl_shang-chi-and-the-legend-of-the-ten-rings-movie-poster_7e09efb1.jpg?v=2024-11-23%2020:41:40",
      description: "Shang-Chi confronts his past when drawn into the web of the Ten Rings organization.",
      releaseDate: "2021-09-03",
      genres: ["Action", "Adventure", "Fantasy"],
      duration: "2h 12m",
      imdbRating: 7.4,
      video: "https://www.youtube.com/embed/NU6g0sDTwP0"
    },
    {
      id: "13",
      title: "The Batman",
      poster: "https://xl.movieposterdb.com/22_06/2022/1877830/xl_1877830_e7d9539b.jpg?v=2025-10-13%2020:23:57",
      description: "Batman uncovers corruption in Gotham connected to his own family as he faces the Riddler.",
      releaseDate: "2022-03-04",
      genres: ["Action", "Crime", "Drama"],
      duration: "2h 56m",
      imdbRating: 7.8,
      video: "https://www.youtube.com/embed/mAKMoM-Ezek"
    },
    {
      id: "14",
      title: "Guardians of the Galaxy Vol. 3",
      poster: "https://xl.movieposterdb.com/23_07/2023/6791350/xl_guardians-of-the-galaxy-vol-3-movie-poster_c1c30df8.png?v=2025-10-02%2017:56:43",
      description: "The Guardians must protect the universe and each other from a new threat.",
      releaseDate: "2023-05-05",
      genres: ["Action", "Adventure", "Comedy"],
      duration: "2h 30m",
      imdbRating: 8.0,
      video: "https://www.youtube.com/embed/u3V8ZO-ZbkE"
    },
    {
      id: "15",
      title: "Mission: Impossible - Dead Reckoning Part One",
      poster: "https://xl.movieposterdb.com/23_06/2023/9603212/xl_mission-impossible-dead-reckoning-part-one-movie-poster_3581b73d.jpg?v=2025-09-06%2002:03:56",
      description: "Ethan Hunt races to stop the AI known as the Entity and prevent global catastrophe.",
      releaseDate: "2025-09-27",
      genres: ["Action", "Thriller", "Adventure"],
      duration: "2h 43m",
      imdbRating: 7.9,
      video: "https://www.youtube.com/embed/WK8eHk7e_Y8"
    },
    // --- Additional movies from JSON below ---
    {
      id: "16",
      title: "Knives Out 3: The Final Cut",
      poster: "https://xl.movieposterdb.com/25_12/2025/12345678/xl_knives-out-3-movie-poster.jpg",
      description: "Detective Benoit Blanc returns to solve his most puzzling case yet, involving a family inheritance and a mysterious disappearance.",
      releaseDate: "2025-12-15",
      genres: ["Mystery", "Crime"],
      duration: "2h 19m",
      imdbRating: 8.3,
      video: "https://www.youtube.com/embed/OMG_aLvBn3o"
    },
    {
      id: "17",
      title: "Frozen III",
      poster: "https://xl.movieposterdb.com/25_12/2025/87654321/xl_frozen-3-movie-poster.jpg",
      description: "Elsa and Anna embark on a new adventure to save Arendelle from a mysterious magical threat.",
      releaseDate: "2025-12-20",
      genres: ["Animation", "Family", "Fantasy"],
      duration: "1h 54m",
      imdbRating: 7.5,
      video: "https://www.youtube.com/embed/yN3DuQ6X3pA"
    },
    {
      id: "18",
      title: "The Lost City of Gold",
      poster: "https://xl.movieposterdb.com/26_01/2026/23456789/xl_lost-city-gold-movie-poster.jpg",
      description: "A team of explorers ventures into the Amazon to uncover the secrets of a legendary city.",
      releaseDate: "2026-01-10",
      genres: ["Adventure", "Fantasy", "Action"],
      duration: "2h 32m",
      imdbRating: 7.2,
      video: "https://www.youtube.com/embed/7ZglrDssZfE"
    },
    {
      id: "19",
      title: "Midnight Express",
      poster: "https://xl.movieposterdb.com/26_02/2026/34567890/xl_midnight-express-movie-poster.jpg",
      description: "A suspenseful thriller about a journalist trapped in a foreign country, racing against time to escape.",
      releaseDate: "2026-02-05",
      genres: ["Thriller", "Drama"],
      duration: "2h 1m",
      imdbRating: 7.6,
      video: "https://www.youtube.com/embed/N8K4-n-SDpc"
    },
    {
      id: "20",
      title: "Galactic Odyssey",
      poster: "https://xl.movieposterdb.com/26_03/2026/45678901/xl_galactic-odyssey-movie-poster.jpg",
      description: "A crew of astronauts embarks on a mission to explore a newly discovered galaxy, facing unknown dangers.",
      releaseDate: "2026-03-12",
      genres: ["Sci-Fi", "Adventure", "Drama"],
      duration: "2h 48m",
      imdbRating: 7.9,
      video: "https://www.youtube.com/embed/e1IxoxLqksw"
    },
    {
      id: "21",
      title: "The Great Heist",
      poster: "https://xl.movieposterdb.com/26_04/2026/56789012/xl_great-heist-movie-poster.jpg",
      description: "A group of skilled thieves plans an elaborate heist on a high-security casino.",
      releaseDate: "2026-04-18",
      genres: ["Crime", "Thriller", "Action"],
      duration: "2h 24m",
      imdbRating: 7.8,
      video: "https://www.youtube.com/embed/9OLx-d7iB6M"
    },
    {
      id: "22",
      title: "Love in Paris",
      poster: "https://xl.movieposterdb.com/26_05/2026/67890123/xl_love-in-paris-movie-poster.jpg",
      description: "A romantic comedy about two strangers who meet by chance in the city of love.",
      releaseDate: "2026-05-14",
      genres: ["Romance", "Comedy"],
      duration: "1h 52m",
      imdbRating: 6.9,
      video: "https://www.youtube.com/embed/TwoUu9ZEHfU"
    },
    {
      id: "23",
      title: "Cybernetic Dawn",
      poster: "https://xl.movieposterdb.com/26_06/2026/78901234/xl_cybernetic-dawn-movie-poster.jpg",
      description: "In a future where AI rules, a small group of rebels fights for humanity's survival.",
      releaseDate: "2026-06-22",
      genres: ["Sci-Fi", "Action", "Thriller"],
      duration: "2h 35m",
      imdbRating: 8.2,
      video: "https://www.youtube.com/embed/hgG1gDXJM-I"
    },
    {
      id: "24",
      title: "The Last Melody",
      poster: "https://xl.movieposterdb.com/26_07/2026/89012345/xl_last-melody-movie-poster.jpg",
      description: "A gifted pianist struggles to compose his final masterpiece as his world unravels.",
      releaseDate: "2026-07-30",
      genres: ["Drama", "Music"],
      duration: "2h 8m",
      imdbRating: 7.3,
      video: "https://www.youtube.com/embed/sMLAUVxB6lY"
    },
    {
      id: "25",
      title: "Shadow Warriors",
      poster: "https://xl.movieposterdb.com/26_08/2026/90123456/xl_shadow-warriors-movie-poster.jpg",
      description: "A team of elite operatives is tasked with stopping a global terrorist threat.",
      releaseDate: "2026-08-19",
      genres: ["Action", "Thriller", "Adventure"],
      duration: "2h 19m",
      imdbRating: 7.6,
      video: "https://www.youtube.com/embed/qlnxQTr48a4"
    }
  ],
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