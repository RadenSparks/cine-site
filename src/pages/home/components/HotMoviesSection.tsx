import { MovieCard } from "../../movies/components/MovieCard";
import MagicText from "../../../components/UI/MagicText";
import ChronicleButton from "../../../components/UI/ChronicleButton";
import type { MovieResponseDTO } from '../../../types/auth';

interface HotMoviesSectionProps {
  movies?: MovieResponseDTO[];
  isLoading?: boolean;
}

export default function HotMoviesSection({ movies = [], isLoading = false }: HotMoviesSectionProps) {
  // Filter for high-rated movies (hot movies are those with rating > 7.5)
  const hotMovies = movies.filter(m => m.rating > 7.5 && !m.deleted).slice(0, 8);

  // If no hot movies found, show first 8 movies as fallback
  const list = hotMovies.length > 0 ? hotMovies : movies.slice(0, 8);

  if (isLoading || !movies.length) {
    return null;
  }

  if (!list.length) return null;

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <MagicText gradientColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starCount={4} gradientSpeed="2.5s" sparkleFrequency={1200} starSize="clamp(18px,2vw,32px)" className="text-3xl sm:text-4xl md:text-5xl font-title font-extrabold leading-tight">Hot Movies</MagicText>
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
          <div className="min-w-0" key={movie.id}>
            <MovieCard
              id={String(movie.id)}
              title={movie.title}
              poster={movie.poster}
              releaseDate={movie.premiereDate}
              description={movie.description}
              genres={movie.genres?.map(g => g.name)}
              bookButtonLink={`/movie/${movie.id}`}
              type="now-showing"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
