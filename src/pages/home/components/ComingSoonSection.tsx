
import { useSelector } from "react-redux";
import { type RootState } from "../../../store";
import { MovieCard } from '../../movies/components/MovieCard';
import MagicText from "../../../components/UI/MagicText";
import ChronicleButton from "../../../components/UI/ChronicleButton";

interface Movie {
  id: string;
  title: string;
  poster: string;
  releaseDate?: string;
  genres?: string[];
}

export default function ComingSoonSection() {
  const movies = useSelector((s: RootState) => s.movies.list) as Movie[] | undefined;
  const now = Date.now();

  const comingSoonFromStore = (Array.isArray(movies) ? movies : []).filter((m) => {
    if (!m.releaseDate) return false;
    const t = Date.parse(m.releaseDate);
    return !Number.isNaN(t) && t > now;
  }).slice(0, 8);

  // fallback static list (kept minimal)
  const fallback = [
    {
      id: 'cs-1',
      title: 'Avatar: The Way of Water',
      poster: "https://xl.movieposterdb.com/23_09/2022/1630029/xl_avatar-the-way-of-water-movie-poster_614883c4.jpg?v=2025-07-11%2013:53:24",
      releaseDate: '2025-10-01',
      genres: ["Adventure", "Fantasy", "Sci-Fi"],
    },
    {
      id: 'cs-2',
      title: 'Mission Impossible: Dead Reckoning',
      poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
      releaseDate: '2025-11-15',
      genres: ["Action", "Thriller"],
    },
  ];

  const list = comingSoonFromStore.length ? comingSoonFromStore : fallback;

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <MagicText gradientColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starCount={4} gradientSpeed="2.5s" sparkleFrequency={1200} starSize="clamp(18px,2vw,32px)" className="text-5xl font-extrabold leading-tight">Coming Soon</MagicText>
        <ChronicleButton
          text="See More Upcoming"
          onClick={() => window.location.href = "/movies?filter=upcoming"}
          customBackground="#4f46e5"
          customForeground="#fff"
          hoverColor="#3730a3"
          width="auto"
        />
      </div>
      <hr className="border-t border-gray-600 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {list.map(movie => (
          <div className="min-w-0">
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={movie.poster}
              releaseDate={movie.releaseDate ?? ""}
              genres={movie.genres}
              type="coming-soon"
            />
          </div>
        ))}
      </div>
    </div>
  );
}