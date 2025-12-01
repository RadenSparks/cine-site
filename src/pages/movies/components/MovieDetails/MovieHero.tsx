import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Shuffle from "../../../../components/UI/Shuffle";
import Countdown from "../../../../components/Countdown";
import { CineButton } from "../../../../components/UI/CineButton";
import {
  CalendarIcon,
  ClockIcon,
  FilmIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface MovieHeroProps {
  movie: {
    id: string;
    title: string;
    poster: string;
    description?: string;
    releaseDate?: string;
    genres?: string[];
    duration?: string;
    imdbRating?: number;
  };
  onWishlistClick?: () => void;
}

export function MovieHero({ movie, onWishlistClick }: MovieHeroProps) {
  const navigate = useNavigate();

  const releaseDate = new Date(movie.releaseDate || "");
  const formattedDate = releaseDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
    >
      {/* Poster */}
      <div className="lg:col-span-1">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl blur opacity-75 animate-pulse"></div>
          <img
            src={movie.poster}
            alt={movie.title}
            className="relative w-full h-auto rounded-2xl shadow-2xl object-cover aspect-[2/3]"
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="lg:col-span-2 flex flex-col justify-start">
        {/* Title with Shuffle Animation */}
        <div className="mb-6 flex justify-center lg:justify-start">
          <Shuffle
            text={movie.title}
            tag="h1"
            shuffleDirection="right"
            duration={0.4}
            stagger={0.05}
            textAlign="left"
            triggerOnHover={true}
            className="text-left"
            style={{ fontSize: "2.5rem", marginBottom: 0, color: "#ffffff" }}
          />
        </div>

        {/* Genres and Countdown */}
        <div className="flex flex-wrap gap-2 items-center w-full mb-6">
          {movie.genres?.map((genre) => (
            <span
              key={genre}
              className="px-4 py-2 bg-slate-900/80 border border-cyan-400/50 text-white font-semibold rounded-full backdrop-blur-md hover:bg-slate-900 transition-all"
            >
              {genre}
            </span>
          ))}
          <div className="ml-auto">
            <div className="bg-slate-900/80 border border-white/20 rounded-lg px-4 py-2 backdrop-blur-md">
              <Countdown
                targetDate={new Date(
                  Date.now() + 2 * 60 * 60 * 1000
                ).toISOString()}
                fontSize={20}
              />
            </div>
          </div>
        </div>

        {/* Embedded Trailer Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mb-6 rounded-lg overflow-hidden"
        >
          <div className="relative w-full bg-black" style={{ aspectRatio: "16/9", height: "300px" }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
            <div className="absolute inset-0 ring-1 ring-white/10 rounded-lg pointer-events-none"></div>
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Release Date */}
          <div className="bg-slate-900/70 border border-cyan-400/30 rounded-lg p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-300 text-sm mb-2 font-medium">
              <CalendarIcon className="w-4 h-4" />
              Release Date
            </div>
            <p className="text-white font-bold text-lg">{formattedDate}</p>
          </div>

          {/* Duration */}
          {movie.duration && (
            <div className="bg-slate-900/70 border border-purple-400/30 rounded-lg p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-purple-300 text-sm mb-2 font-medium">
                <ClockIcon className="w-4 h-4" />
                Duration
              </div>
              <p className="text-white font-bold text-lg">{movie.duration}</p>
            </div>
          )}

          {/* Rating */}
          {movie.duration && (
            <div className="bg-slate-900/70 border border-pink-400/30 rounded-lg p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-pink-300 text-sm mb-2 font-medium">
                <FilmIcon className="w-4 h-4" />
                Rating
              </div>
              <p className="text-white font-bold text-lg">PG-13</p>
            </div>
          )}

          {/* IMDb Rating */}
          <div className="bg-slate-900/70 border border-yellow-400/30 rounded-lg p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-yellow-300 text-sm mb-2 font-medium">
              <StarIcon className="w-4 h-4" />
              IMDb Rating
            </div>
            <p className="text-white font-bold text-lg">
              {(movie.imdbRating ?? 0).toFixed(1)}/10
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <CineButton
            onClick={() => navigate(`/booking/${movie.id}`)}
            className="flex-1 justify-center"
          >
            Book Tickets
          </CineButton>
          <CineButton onClick={onWishlistClick} className="px-6 py-3">
            Add to Wishlist
          </CineButton>
        </div>
      </div>
    </motion.div>
  );
}
