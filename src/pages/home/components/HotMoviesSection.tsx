import { useSelector } from "react-redux";
import { type RootState } from "../../../store";
import { MovieCard } from "../../movies/components/MovieCard";
import MagicText from "../../../components/UI/MagicText";
import ChronicleButton from "../../../components/UI/ChronicleButton";

interface Movie {
  id: string;
  title: string;
  poster: string;
  releaseDate?: string;
  description?: string;
  genres?: string[];
  isHot?: boolean;
}

export default function HotMoviesSection() {
  const movies = useSelector((s: RootState) => s.movies.list) as Movie[] | undefined;
  // Filter for hot movies, fallback to first 8 if none marked
  const hotList = Array.isArray(movies)
    ? movies.filter(m => m.isHot).slice(0, 8)
    : [];
  const fallback = [
    {
      id: 'hot-1',
      title: 'Dune: Part Two',
      poster: 'https://image.tmdb.org/t/p/w500/8uVKfCkP0pX8QkP0fHnGk2mP0rX8.jpg',
      releaseDate: '2025-03-01',
      description: 'The epic sci-fi saga continues as Paul Atreides unites with the Fremen.',
      genres: ['Sci-Fi', 'Adventure'],
      isHot: true,
    },
    {
      id: 'hot-2',
      title: 'Deadpool 3',
      poster: 'https://image.tmdb.org/t/p/w500/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg',
      releaseDate: '2025-07-15',
      description: 'The Merc with a Mouth returns for more R-rated superhero antics.',
      genres: ['Action', 'Comedy'],
      isHot: true,
    },
    {
      id: 'hot-3',
      title: 'Inside Out 2',
      poster: 'https://image.tmdb.org/t/p/w500/2vFuG6bWGyQUzYS9d69E5l85nIz.jpg',
      releaseDate: '2025-06-20',
      description: 'Joy, Sadness, and the gang are back for more emotional adventures.',
      genres: ['Animation', 'Family'],
      isHot: true,
    },
    {
      id: 'hot-4',
      title: 'Mission Impossible: Dead Reckoning',
      poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
      releaseDate: '2025-11-15',
      description: 'Ethan Hunt faces his most dangerous mission yet.',
      genres: ['Action', 'Thriller'],
      isHot: true,
    },
  ];
  const list = hotList.length ? hotList : fallback;

  if (!list.length) return null;

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <MagicText gradientColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starCount={4} gradientSpeed="2.5s" sparkleFrequency={1200} starSize="clamp(18px,2vw,32px)" className="text-5xl font-extrabold leading-tight">Hot Movies</MagicText>
        <ChronicleButton
          text="See More Hot"
          onClick={() => window.location.href = "/movies?filter=hot"}
          customBackground="#be185d"
          customForeground="#fff"
          hoverColor="#9d174d"
          width="auto"
        />
      </div>
      <hr className="border-t border-gray-600 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {list.map((movie) => (
          <div className="min-w-0">
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={movie.poster}
              releaseDate={movie.releaseDate ?? ""}
              description={movie.description}
              genres={movie.genres}
              bookButtonLink={`/movie/${movie.id}`}
              type="now-showing"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
