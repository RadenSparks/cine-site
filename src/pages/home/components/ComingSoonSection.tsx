
import { MovieCard } from '../../movies/components/MovieCard';
import MagicText from "../../../components/UI/MagicText";
import ChronicleButton from "../../../components/UI/ChronicleButton";
import type { MovieResponseDTO } from '../../../types/auth';

interface ComingSoonSectionProps {
  movies?: MovieResponseDTO[];
  isLoading?: boolean;
}

export default function ComingSoonSection({ movies = [], isLoading = false }: ComingSoonSectionProps) {
  // Filter movies that are coming soon (future release dates)
  const today = new Date().toISOString().split('T')[0];
  const comingSoonMovies = movies.filter((m) => {
    return m.premiereDate && m.premiereDate > today && !m.deleted;
  }).slice(0, 8);

  if (isLoading || !movies.length || comingSoonMovies.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <MagicText gradientColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starCount={4} gradientSpeed="2.5s" sparkleFrequency={1200} starSize="clamp(18px,2vw,32px)" className="text-3xl sm:text-4xl md:text-5xl font-title font-extrabold leading-tight">Coming Soon</MagicText>
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
        {comingSoonMovies.map(movie => (
          <div className="min-w-0" key={movie.id}>
            <MovieCard
              id={String(movie.id)}
              title={movie.title}
              poster={movie.poster}
              releaseDate={movie.premiereDate}
              genres={movie.genres?.map(g => g.name)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}