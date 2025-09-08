import { Skeleton, Pagination } from '@heroui/react';
import { useState } from 'react';
import { CineCard } from './UI/CineCard';

interface Movie {
  id: string;
  title: string;
  poster: string;
  description: string;
  releaseDate: string;
}

export default function NowShowingSection({ movies }: { movies: Movie[] }) {
  const [page, setPage] = useState(1);
  const pageSize = 8; // Show 4 per row, 2 rows per page
  const pagedMovies = movies.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4 text-white">Now Showing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {pagedMovies.length === 0
          ? Array.from({ length: pageSize }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded" />
            ))
          : pagedMovies.map((movie) => (
              <CineCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster={movie.poster}
                releaseDate={movie.releaseDate}
                description={movie.description}
                showBookButton={false}
                disabled={true}
              />
            ))}
      </div>
      <div className="flex justify-center mt-6">
        <Pagination
          total={Math.ceil(movies.length / pageSize)}
          page={page}
          onChange={setPage}
        />
      </div>
    </div>
  );
}