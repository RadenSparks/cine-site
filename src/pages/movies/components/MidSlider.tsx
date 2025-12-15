import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Skeleton } from '@heroui/react';
import { motion } from 'framer-motion';
import { TrailerModal } from '../../../components/UI/TrailerModal';

interface SliderItem {
  id: string;
  title: string;
  genre: string;
  metadata: string;
  backgroundImage: string;
  video?: string;
}

interface MidSliderProps {
  items?: SliderItem[];
  autoplayInterval?: number;
  isLoading?: boolean;
}

export function MidSlider({ items = [], autoplayInterval = 5000, isLoading = false }: MidSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [selectedTrailerIndex, setSelectedTrailerIndex] = useState(0);

  // Only reset index if items array is truly empty (initial load), NOT on every filter change
  useEffect(() => {
    // Only reset if we go from having items to having NO items
    if (!isLoading && (!items || items.length === 0)) {
      setActiveIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (!isAutoplay || !items || items.length === 0 || isLoading) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoplay, items.length, autoplayInterval, isLoading]);

  // Show skeleton loading if isLoading is true or items is empty
  if (isLoading || !items || items.length === 0) {
    return (
      <motion.section 
        className="w-full mid-slider-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Skeleton className="rounded-2xl">
          <div className="w-full h-96 rounded-2xl bg-default-300" />
        </Skeleton>
      </motion.section>
    );
  }

  const goToPrevious = () => {
    setIsAutoplay(false);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setIsAutoplay(false);
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoplay(false);
    setActiveIndex(index);
  };

  return (
    <motion.section 
      className="w-full mid-slider-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
        {/* Slider Items */}
        <div className="relative w-full h-96">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${item.backgroundImage})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-3xl">
                  <div className="text-white max-w-2xl">
                    {/* Genre Label */}
                    <span className="inline-block text-xs md:text-sm font-button font-bold bg-orange-600 px-3 md:px-4 py-1 rounded-full mb-2 md:mb-4">
                      {item.genre}
                    </span>

                    {/* Title */}
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-title font-extrabold leading-tight line-clamp-3 mb-2 md:mb-4">
                      {item.title}
                    </h2>

                    {/* Metadata */}
                    <p className="text-gray-300 text-sm md:text-lg line-clamp-1 mb-4 md:mb-6 font-body">{item.metadata}</p>
                  </div>
                </div>

                {/* Watch Trailer Button - Fixed positioning */}
                <button
                  onClick={() => {
                    setSelectedTrailerIndex(index);
                    setIsTrailerModalOpen(true);
                  }}
                  className="cursor-target btn absolute bottom-8 left-4 md:bottom-10 md:left-12 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-button font-bold py-2 px-6 rounded-lg transition-colors duration-200 group text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <Play size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Watch Trailer</span> 
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="cursor-target absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={goToNext}
          className="cursor-target absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight size={28} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`cursor-target w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-blue-600 w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <TrailerModal
        isOpen={isTrailerModalOpen}
        videoUrl={items[selectedTrailerIndex]?.video}
        title={items[selectedTrailerIndex]?.title}
        onClose={() => setIsTrailerModalOpen(false)}
      />
    </motion.section>
  );
}

export default MidSlider;
