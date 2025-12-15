import { Skeleton } from '@heroui/react';
import { MovieCard } from '../../movies/components/MovieCard';
import MagicText from "../../../components/UI/MagicText";
import ChronicleButton from "../../../components/UI/ChronicleButton";
import type { MovieResponseDTO } from '../../../types/auth';

interface NowShowingSectionProps {
  movies?: MovieResponseDTO[];
  isLoading?: boolean;
}

export default function NowShowingSection({ movies = [], isLoading = false }: NowShowingSectionProps) {
  // Filter movies that have already been released (or released today)
  const today = new Date().toISOString().split('T')[0];
  const nowShowingMovies = movies.filter((m) => {
    return m.premiereDate && m.premiereDate <= today && !m.deleted;
  }).slice(0, 8);

  if (isLoading || !movies.length) {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-title font-bold mb-4 text-white">Now Showing</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="rounded-lg">
                <div className="h-80 w-full rounded-lg bg-default-300" />
              </Skeleton>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no movies are currently showing, show message with fallback
  if (nowShowingMovies.length === 0) {
    return (
      <div className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <MagicText gradientColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starCount={4} gradientSpeed="2.5s" sparkleFrequency={1200} starSize="clamp(18px,2vw,32px)" className="text-3xl sm:text-4xl md:text-5xl font-title font-extrabold leading-tight">Now Showing</MagicText>
        </div>
        <hr className="border-t border-gray-600 mb-6" />
        <p className="text-gray-400 text-center py-8">No movies currently showing. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <MagicText gradientColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starCount={4} gradientSpeed="2.5s" sparkleFrequency={1200} starSize="clamp(18px,2vw,32px)" className="text-3xl sm:text-4xl md:text-5xl font-title font-extrabold leading-tight">Now Showing</MagicText>
        <ChronicleButton
          text="See More Now Showing"
          onClick={() => window.location.href = "/movies?filter=now-showing"}
          customBackground="#2563eb"
          customForeground="#fff"
          hoverColor="#1d4ed8"
          width="auto"
        />
      </div>
      <hr className="border-t border-gray-600 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {nowShowingMovies.map((movie) => (
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