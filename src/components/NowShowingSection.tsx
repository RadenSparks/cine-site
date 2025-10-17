
import { Skeleton } from '@heroui/react';
import { useSelector } from "react-redux";
import { type RootState } from "../store";
import { CineCard } from './UI/CineCard';

interface Movie {
  id: string;
  title: string;
  poster: string;
  description?: string;
  releaseDate?: string;
}

export default function NowShowingSection() {
  const movies = useSelector((s: RootState) => s.movies.list) as Movie[] | undefined;
  const list = Array.isArray(movies) ? movies.slice(0, 4) : [];

  if (!movies) {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-white">Now Showing</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4 text-white">Now Showing</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {list.map((movie) => (
          <CineCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster={movie.poster}
            releaseDate={movie.releaseDate ?? ""}
            description={movie.description}
            showBookButton={true}
            disabled={false}
            bookButtonLink={`/movie/${movie.id}`}
          />
        ))}
      </div>
    </div>
  );
}