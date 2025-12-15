import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MovieResponseDTO } from '../../../types/auth';
import CardSwap, { Card } from '../../../components/CardSwap';
import { MovieGalleryModal } from './MovieDetails/MovieGalleryModal';

interface FeaturedMoviesSectionProps {
  movies: MovieResponseDTO[];
  isLoading?: boolean;
}

// Memoized CardSwap section to prevent re-renders from parent state changes
const CardSwapSection = React.memo(({ movies, onSwap }: { movies: MovieResponseDTO[]; onSwap: (index: number) => void }) => (
  <div className="lg:col-span-1 flex justify-center" style={{ position: 'relative', pointerEvents: 'none' }}>
    <div className="relative w-full flex justify-center" style={{ minHeight: '480px', pointerEvents: 'none' }}>
      <CardSwap
        width={240}
        height={360}
        cardDistance={35}
        verticalDistance={45}
        delay={5000}
        pauseOnHover={false}
        skewAmount={3}
        easing="elastic"
        onSwap={onSwap}
      >
        {movies.map((movie) => (
          <Card
            key={String(movie.id)}
            className="cursor-default"
            style={{
              backgroundImage: `url(${movie.poster})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </CardSwap>
    </div>
  </div>
));

CardSwapSection.displayName = 'CardSwapSection';

const FeaturedMoviesSectionComponent: React.FC<FeaturedMoviesSectionProps> = ({ movies, isLoading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryIndexByMovie, setGalleryIndexByMovie] = useState<Record<string, number>>(() =>
    movies.reduce((acc, movie) => ({ ...acc, [movie.id]: 0 }), {})
  );

  // Define callbacks before guard
  const handleCardSwap = useCallback((cardIndex: number) => {
    setActiveIndex(cardIndex);
  }, []);

  // Guard: Return skeleton if no movies or still loading
  if (isLoading || movies.length === 0) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl font-title font-bold text-white mb-2">
            Featured Movies
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>

        {/* Skeleton Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left - Details Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-slate-800 rounded animate-pulse"></div>
            <div className="h-40 bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-64 bg-slate-800 rounded-lg animate-pulse"></div>
          </div>

          {/* Right - CardSwap Skeleton */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="w-full h-96 bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure activeIndex is within bounds
  const boundedActiveIndex = Math.min(activeIndex, movies.length - 1);
  const activeMovie = movies[boundedActiveIndex];
  
  // Use movie poster as gallery image (can be extended with multiple images if API provides them)
  const galleryImages = activeMovie ? [activeMovie.poster] : [];
  const selectedGalleryIndex = activeMovie ? (galleryIndexByMovie[activeMovie.id] || 0) : 0;

  const handleGallerySelect = (idx: number) => {
    setGalleryIndexByMovie(prev => ({
      ...prev,
      [activeMovie.id]: idx
    }));
  };

  const handleNextGalleryImage = () => {
    handleGallerySelect((selectedGalleryIndex + 1) % (galleryImages.length || 1));
  };

  const handlePrevGalleryImage = () => {
    handleGallerySelect((selectedGalleryIndex - 1 + (galleryImages.length || 1)) % (galleryImages.length || 1));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-4xl font-title font-bold text-white mb-2">
          Featured Movies
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
      </div>

      {/* Main Container - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" style={{ isolation: 'isolate' }}>
        {/* Left - Details and Gallery */}
        <div className="lg:col-span-2 space-y-6" style={{ pointerEvents: 'auto' }}>
          {/* Movie Info */}
          <motion.div
            key={`info-${activeIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {/* Title */}
            <div>
              <h3 className="text-xl md:text-2xl font-title font-bold text-white mb-1">
                {activeMovie.title}
              </h3>
              <p className="text-amber-400 text-xs md:text-sm font-semibold drop-shadow-lg font-label">
                {activeMovie.premiereDate && `${new Date(activeMovie.premiereDate).getFullYear()}`}
                {activeMovie.duration && ` • ${Math.floor(activeMovie.duration / 60)}h ${activeMovie.duration % 60}m`}
              </p>
            </div>

            {/* Genres */}
            {activeMovie.genres && activeMovie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {activeMovie.genres.slice(0, 2).map((genre) => (
                  <span
                    key={String(genre.id)}
                    className="px-2 py-0.5 bg-blue-600/30 border border-blue-400/50 text-blue-200 rounded-full text-xs font-medium font-label"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Gallery Reel */}
          <div className="space-y-2">
            <p className="text-slate-300 text-xs font-semibold font-label">Gallery</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={`gallery-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full rounded-lg overflow-hidden border border-slate-700/50 cursor-pointer hover:border-slate-600 transition-colors"
                style={{ aspectRatio: '16 / 9', maxHeight: '180px' }}
                onClickCapture={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                <img
                  src={galleryImages[selectedGalleryIndex]}
                  alt="Gallery"
                  className="w-full h-full object-cover"
                />
                {/* Overlay hint */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Gallery Thumbnails - Only for active movie */}
            <div className="flex gap-1.5 overflow-x-auto pb-1.5">
              {galleryImages.map((image, idx) => (
                <motion.button
                  key={idx}
                  onClickCapture={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleGallerySelect(idx);
                  }}
                  className={`relative flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                    selectedGalleryIndex === idx
                      ? 'border-blue-500 shadow-lg shadow-blue-500/50'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                  style={{ width: '50px', height: '35px' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={image}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Status', value: 'Featured' },
              { label: 'Popularity', value: 'Trending' },
              { label: 'Rating', value: '8.5/10' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-2 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
              >
                <p className="text-xs text-slate-400 font-medium font-label">{stat.label}</p>
                <p className="text-sm font-bold text-white mt-0.5 font-body">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Movie Indicators */}
          <div className="flex gap-1.5 pt-2">
            {movies.map((_, idx) => (
              <motion.button
                key={idx}
                onClickCapture={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className="rounded-full transition-all"
                style={{
                  width: idx === activeIndex ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: idx === activeIndex ? 'rgb(59, 130, 246)' : 'rgb(71, 85, 105)',
                }}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>

        {/* Right - Card Swap */}
        <CardSwapSection movies={movies} onSwap={handleCardSwap} />
      </div>

      {/* Gallery Modal */}
      <MovieGalleryModal
        isOpen={isModalOpen}
        galleryImages={galleryImages}
        selectedImageIndex={selectedGalleryIndex}
        onClose={() => setIsModalOpen(false)}
        onNextImage={handleNextGalleryImage}
        onPrevImage={handlePrevGalleryImage}
        onImageSelect={handleGallerySelect}
      />
    </div>
  );
};

export const FeaturedMoviesSection = React.memo(FeaturedMoviesSectionComponent);

export default FeaturedMoviesSection;
