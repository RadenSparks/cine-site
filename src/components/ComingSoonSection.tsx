
import { useSelector } from "react-redux";
import { type RootState } from "../store";
import { CineCard } from './UI/CineCard';

interface Movie {
  id: string;
  title: string;
  poster: string;
  releaseDate?: string;
}

export default function ComingSoonSection() {
  const movies = useSelector((s: RootState) => s.movies.list) as Movie[] | undefined;
  const now = Date.now();

  const comingSoonFromStore = (Array.isArray(movies) ? movies : []).filter((m) => {
    if (!m.releaseDate) return false;
    const t = Date.parse(m.releaseDate);
    return !Number.isNaN(t) && t > now;
  }).slice(0, 4);

  // fallback static list (kept minimal)
  const fallback = [
    {
      id: 'cs-1',
      title: 'Avatar: The Way of Water',
      poster: "https://xl.movieposterdb.com/23_09/2022/1630029/xl_avatar-the-way-of-water-movie-poster_614883c4.jpg?v=2025-07-11%2013:53:24",
      releaseDate: '2025-10-01',
    },
    {
      id: 'cs-2',
      title: 'Mission Impossible: Dead Reckoning',
      poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
      releaseDate: '2025-11-15',
    },
  ];

  const list = comingSoonFromStore.length ? comingSoonFromStore : fallback;

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4 text-white">Coming Soon</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {list.map(movie => (
          <CineCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster={movie.poster}
            releaseDate={movie.releaseDate ?? ""}
            showBookButton={false}
            disabled={true}
          />
        ))}
      </div>
    </div>
  );
}