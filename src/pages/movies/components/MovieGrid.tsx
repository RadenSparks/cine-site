import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@heroui/react';
import { motion } from 'framer-motion';
import type { MovieResponseDTO } from '../../../types/auth';

interface MovieGridProps {
  movies: MovieResponseDTO[] | undefined;
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
        {/* <h2 className="text-2xl font-title font-bold mb-6 text-white">Movies</h2> */}
        <div className="grid grid-cols-5 gap-2 md:gap-2.5 min-h-[280px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="rounded-lg">
                <div className="w-full aspect-square rounded-lg bg-default-300" />
              </Skeleton>
            </div>
          ))}
        </div>
      </motion.section>
    );
  }

  // Show empty state if no movies to display
  if (movies.length === 0) {
    return (
      <motion.section 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="space-y-4"
          >
            {/* <div className="text-6xl mb-4">🎬</div> */}
            <h3 className="text-2xl md:text-3xl font-title font-extrabold text-white mb-2">
              No Movies Found
            </h3>
            {/* <p className="text-slate-400 text-base md:text-lg max-w-md">
              Try adjusting your filters or genre selection to see more movies.
            </p> */}
          </motion.div>
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
      {/* <h2 className="text-2xl font-title font-bold mb-6 text-white">Movies</h2> */}
      <motion.div 
        className="grid grid-cols-5 gap-2 md:gap-2.5 min-h-[280px]"
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
            key={String(movie.id)}
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
              to={`/movie/${String(movie.id)}`}
              onMouseEnter={() => setHoveredMovieCardId(String(movie.id))}
              onMouseLeave={() => setHoveredMovieCardId(null)}
              className={`relative rounded-lg overflow-hidden bg-slate-900 transition-all duration-300 ease-out group aspect-square flex ${
                hoveredMovieCardId !== null && hoveredMovieCardId !== String(movie.id) ? 'blur-sm scale-95' : ''
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
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-end justify-end p-2 md:p-3 transition-opacity duration-300 ${
                  hoveredMovieCardId === String(movie.id) ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="w-full text-right">
                  {/* Title */}
                  <h3 className="text-xs md:text-sm font-title font-bold text-white line-clamp-2 mb-1">
                    {movie.title}
                  </h3>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-0.5 justify-end mb-1">
                    {movie.genres?.slice(0, 1).map((g) => (
                      <span
                        key={String(g.id)}
                        className="text-xs bg-blue-600/70 text-white px-1 py-0.5 rounded-full font-semibold font-label"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-gray-300 space-y-0.5 font-body">
                    {movie.duration && <div className="text-xs line-clamp-1">{movie.duration}</div>}
                    {movie.rating && (
                      <div className="inline-block bg-red-600/80 text-white px-1 py-0.5 rounded text-xs font-semibold font-label">
                        {movie.rating}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating Badge (always visible) */}
              {movie.rating && (
                <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-red-600/90 text-white text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded z-10">
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
