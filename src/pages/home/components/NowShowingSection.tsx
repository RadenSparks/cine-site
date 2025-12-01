
import { Skeleton } from '@heroui/react';
import { useSelector } from "react-redux";
import { type RootState } from "../../../store";
import { MovieCard } from '../../movies/components/MovieCard';
import MagicText from "../../../components/UI/MagicText";
import ChronicleButton from "../../../components/UI/ChronicleButton";

interface Movie {
  id: string;
  title: string;
  poster: string;
  description?: string;
  releaseDate?: string;
  genres?: string[];
}

export default function NowShowingSection() {
  const movies = useSelector((s: RootState) => s.movies.list) as Movie[] | undefined;
  const list = Array.isArray(movies) ? movies.slice(0, 8) : [];

  if (!movies) {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-white">Now Showing</h2>
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

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <MagicText gradientColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starCount={4} gradientSpeed="2.5s" sparkleFrequency={1200} starSize="clamp(18px,2vw,32px)" className="text-5xl font-extrabold leading-tight">Now Showing</MagicText>
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