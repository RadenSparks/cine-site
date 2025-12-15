import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Shuffle from "../../../../components/UI/Shuffle";
import Countdown from "../../../../components/Countdown";
import { CineButton } from "../../../../components/UI/CineButton";
import type { MovieResponseDTO } from "../../../../types/auth";
import {
  CalendarIcon,
  ClockIcon,
  FilmIcon,
  StarIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

interface MovieHeroProps {
  movie: MovieResponseDTO;
  onWishlistClick?: () => void;
}

/**
 * Convert various video URL formats to embeddable iframe src
 */
function getEmbeddableUrl(url: string): { embedUrl: string; isEmbeddable: boolean } {
  if (!url) return { embedUrl: "", isEmbeddable: false };

  // YouTube URL patterns
  const youtubePatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        embedUrl: `https://www.youtube.com/embed/${match[1]}`,
        isEmbeddable: true,
      };
    }
  }

  // Vimeo URL patterns
  const vimeoPattern = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;
  const vimeoMatch = url.match(vimeoPattern);
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isEmbeddable: true,
    };
  }

  // Check if URL is already an embed URL
  if (url.includes("youtube.com/embed") || url.includes("player.vimeo.com")) {
    return { embedUrl: url, isEmbeddable: true };
  }

  // For other URLs, we'll open in new tab instead of embedding
  return { embedUrl: url, isEmbeddable: false };
}

export function MovieHero({ movie, onWishlistClick }: MovieHeroProps) {
  const navigate = useNavigate();

  const releaseDate = new Date(movie.premiereDate || "");
  const formattedDate = releaseDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { embedUrl, isEmbeddable } = getEmbeddableUrl(movie.teaser || "");

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
              key={String(genre.id)}
              className="px-4 py-2 bg-slate-900/80 border border-cyan-400/50 text-white font-semibold rounded-full backdrop-blur-md hover:bg-slate-900 transition-all"
            >
              {genre.name}
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
            {movie.teaser && isEmbeddable ? (
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title={`${movie.title} - Teaser`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : movie.teaser && !isEmbeddable ? (
              <a
                href={movie.teaser}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 transition-all group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 group-hover:bg-blue-700 flex items-center justify-center mx-auto mb-3 transition-colors">
                    <PlayIcon className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-white font-semibold group-hover:text-blue-300 transition-colors">Watch Teaser</p>
                  <p className="text-slate-400 text-sm mt-1 font-body">Opens in new window</p>
                </div>
              </a>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="text-center">
                  <FilmIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No teaser available</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-white/10 rounded-lg pointer-events-none"></div>
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Release Date */}
          <div className="bg-slate-900/70 border border-cyan-400/30 rounded-lg p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-300 text-sm mb-2 font-medium font-label">
              <CalendarIcon className="w-4 h-4" />
              Release Date
            </div>
            <p className="text-white font-bold text-lg font-body">{formattedDate}</p>
          </div>

          {/* Duration */}
          {movie.duration && (
            <div className="bg-slate-900/70 border border-purple-400/30 rounded-lg p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-purple-300 text-sm mb-2 font-medium font-label">
                <ClockIcon className="w-4 h-4" />
                Duration
              </div>
              <p className="text-white font-bold text-lg font-body">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</p>
            </div>
          )}

          {/* Rating */}
          {movie.duration && (
            <div className="bg-slate-900/70 border border-pink-400/30 rounded-lg p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-pink-300 text-sm mb-2 font-medium font-label">
                <FilmIcon className="w-4 h-4" />
                Rating
              </div>
              <p className="text-white font-bold text-lg font-body">PG-13</p>
            </div>
          )}

          {/* IMDb Rating */}
          <div className="bg-slate-900/70 border border-yellow-400/30 rounded-lg p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-yellow-300 text-sm mb-2 font-medium font-label">
              <StarIcon className="w-4 h-4" />
              IMDb Rating
            </div>
            <p className="text-white font-bold text-lg font-body">
              {(movie.rating ?? 0).toFixed(1)}/10
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <CineButton
            onClick={() => navigate(`/booking/${String(movie.id)}`, { state: { movie } })}
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
