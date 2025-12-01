import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@heroui/react';
import { motion } from 'framer-motion';

type Movie = {
  id: string;
  title: string;
  poster: string;
  description?: string;
  releaseDate?: string;
  genres?: string[];
  duration?: string;
  rating?: string;
};

interface MovieGridProps {
  movies: Movie[] | undefined;
  isLoading?: boolean;
}

export function MovieGrid({ movies, isLoading = false }: MovieGridProps) {
  const [hoveredMovieCardId, setHoveredMovieCardId] = useState<string | null>(null);

  // Show skeleton loading if isLoading is true or movies is undefined
  if (isLoading || !movies) {
    return (
      <motion.section 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="rounded-lg">
                <div className="h-48 md:h-64 w-full rounded-lg bg-default-300" />
              </Skeleton>
            </div>
          ))}
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      className="mb-12"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-white">Movies</h2>
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
        layout
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {movies.map((movie) => (
          <motion.div
            key={movie.id}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.4,
                  ease: "easeOut",
                },
              },
            }}
          >
            <Link
              to={`/movie/${movie.id}`}
              onMouseEnter={() => setHoveredMovieCardId(movie.id)}
              onMouseLeave={() => setHoveredMovieCardId(null)}
              className={`relative rounded-lg overflow-hidden bg-slate-900 transition-all duration-300 ease-out group h-48 md:h-64 flex ${
                hoveredMovieCardId !== null && hoveredMovieCardId !== movie.id ? 'blur-sm scale-95' : ''
              }`}
            >
              {/* Poster Image */}
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-end justify-end p-3 transition-opacity duration-300 ${
                  hoveredMovieCardId === movie.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="w-full text-right">
                  {/* Title */}
                  <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 mb-2">
                    {movie.title}
                  </h3>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 justify-end mb-2">
                    {movie.genres?.slice(0, 2).map((g: string) => (
                      <span
                        key={g}
                        className="text-xs bg-blue-600/70 text-white px-1.5 py-0.5 rounded-full font-semibold"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-gray-300 space-y-1">
                    {movie.duration && <div>{movie.duration}</div>}
                    {movie.rating && (
                      <div className="inline-block bg-red-600/80 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                        {movie.rating}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating Badge (always visible) */}
              {movie.rating && (
                <div className="absolute top-2 left-2 bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  {movie.rating}
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default MovieGrid;
