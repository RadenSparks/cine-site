import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
     {
    id: "1",
    title: "Pacific Rim",
    poster: "https://xl.movieposterdb.com/13_08/2013/1663662/xl_1663662_2845b9a6.jpg?v=2024-12-04%2021:28:23",
    description: "When legions of Kaiju rise from the sea, humanity fights back with giant robots piloted in pairs.",
    releaseDate: "2025-09-20",
  },
  {
    id: "2",
    title: "Into The Spider-Verse",
    poster: "https://xl.movieposterdb.com/22_10/2018/4633694/xl_spider-man-into-the-spider-verse-movie-poster_a7f62b30.jpeg?v=2025-10-06%2003:38:07",
    description: "Miles Morales teams up with Spider-people from other dimensions to save the multiverse.",
    releaseDate: "2025-09-23",
  },
  {
    id: "3",
    title: "Thunderbolts",
    poster: "https://xl.movieposterdb.com/25_04/2025/20969586/xl_thunderbolts-movie-poster_31856c6e.jpg?v=2025-08-28%2020:27:02",
    description: "A team of anti-heroes undertake missions that require morally flexible methods.",
    releaseDate: "2025-09-25",
  },
  {
    id: "4",
    title: "Avatar: The Way of Water",
    poster: "https://xl.movieposterdb.com/23_09/2022/1630029/xl_avatar-the-way-of-water-movie-poster_614883c4.jpg?v=2025-07-11%2013:53:24",
    description: "Jake Sully and his family fight to stay together on Pandora.",
    releaseDate: "2025-09-28",
  },
  {
    id: "5",
    title: "How to Train Your Dragon: Live Action",
    poster: "https://xl.movieposterdb.com/25_06/2025/26743210/xl_how-to-train-your-dragon-movie-poster_1cd1e772.jpg?v=2025-07-19%2001:42:02",
    description: "Live-action adaptation about a young Viking who befriends a dragon.",
    releaseDate: "2025-10-01",
  },
  {
    id: "6",
    title: "Just Like Heaven",
    poster: "https://xl.movieposterdb.com/05_11/2005/0425123/xl_64709_0425123_1ae81faf.jpg?v=2023-01-16%2022:41:26",
    description: "A man falls in love with the spirit of a woman living in his apartment.",
    releaseDate: "2025-09-10",
  },
  {
    id: "7",
    title: "Tick, Tick... Boom!",
    poster: "https://image.tmdb.org/t/p/original/DPmfcuR8fh8ROYXgdjrAjSGA0o.jpg",
    description: "A struggling composer navigates love, friendship, and the pressures of life.",
    releaseDate: "2025-09-24",
  },
  {
    id: "8",
    title: "The Social Network",
    poster: "https://xl.movieposterdb.com/11_06/2010/1285016/xl_1285016_6a84335f.jpg?v=2022-08-15%2019:28:13",
    description: "The story behind the founding of Facebook and the fallout that followed.",
    releaseDate: "2010-10-01",
  },
  {
    id: "9",
    title: "Inception",
    poster: "https://xl.movieposterdb.com/10_06/2010/1375666/xl_1375666_07030c72.jpg?v=2025-10-05%2011:02:41",
    description: "A thief uses dream-sharing technology to plant an idea into a CEO's mind.",
    releaseDate: "2010-07-16",
  },
  {
    id: "10",
    title: "The Matrix Resurrections",
    poster: "https://xl.movieposterdb.com/22_01/2021/10838180/xl_10838180_e925675f.jpg?v=2022-01-25%2015:20:22",
    description: "Neo returns to the Matrix to confront his past and new threats.",
    releaseDate: "2021-12-22",
  },
  {
    id: "11",
    title: "Dune",
    poster: "https://xl.movieposterdb.com/21_09/2021/1160419/xl_1160419_f865cf40.jpg?v=2025-07-08%2018:49:19",
    description: "A noble family is drawn into a war for control of the galaxy's most valuable asset.",
    releaseDate: "2021-10-22",
  },
  {
    id: "12",
    title: "Shang-Chi and the Legend of the Ten Rings",
    poster: "https://xl.movieposterdb.com/24_11/2021/9376612/xl_shang-chi-and-the-legend-of-the-ten-rings-movie-poster_7e09efb1.jpg?v=2024-11-23%2020:41:40",
    description: "Shang-Chi confronts his past when drawn into the web of the Ten Rings organization.",
    releaseDate: "2021-09-03",
  },
  {
    id: "13",
    title: "The Batman",
    poster: "https://xl.movieposterdb.com/22_06/2022/1877830/xl_1877830_e7d9539b.jpg?v=2025-10-13%2020:23:57",
    description: "Batman uncovers corruption in Gotham connected to his own family as he faces the Riddler.",
    releaseDate: "2022-03-04",
  },
  {
    id: "14",
    title: "Guardians of the Galaxy Vol. 3",
    poster: "https://xl.movieposterdb.com/23_07/2023/6791350/xl_guardians-of-the-galaxy-vol-3-movie-poster_c1c30df8.png?v=2025-10-02%2017:56:43",
    description: "The Guardians must protect the universe and each other from a new threat.",
    releaseDate: "2023-05-05",
  },
  {
    id: "15",
    title: "Mission: Impossible - Dead Reckoning Part One",
    poster: "https://xl.movieposterdb.com/23_06/2023/9603212/xl_mission-impossible-dead-reckoning-part-one-movie-poster_3581b73d.jpg?v=2025-09-06%2002:03:56",
    description: "Ethan Hunt races to stop the AI known as the Entity and prevent global catastrophe.",
    releaseDate: "2025-09-27",
  }
  ],
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
});

export default moviesSlice.reducer;