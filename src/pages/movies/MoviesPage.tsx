import AppNavbar from '../../components/Layout/Navbar';
import AppFooter from '../../components/Layout/Footer';
import { AuroraBackground } from '../../components/Layout/AuroraBackground';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FeaturedMoviesSection from './components/FeaturedMoviesSection';
import MidSlider from './components/MidSlider';
import MovieGrid from './components/MovieGrid';
import { usePublicMovies, usePublicGenres } from '../../hooks';

import type { GenreDTO } from '../../types/auth';

// Genres are provided by `usePublicGenres()` hook

// Movie List Page (was MoviesPage)
export function MoviesPage() {
  const {
    movies,
    isLoading,
    totalPages,
    currentPage,
    isLastPage,
    fetchMovies,
  } = usePublicMovies();

  const { genres, isLoading: genresLoading, getGenreByName } = usePublicGenres();

  // Keep a reference to the initial movies load for independent featured/slider sections
  const initialMoviesRef = useRef<typeof movies | null>(null);
  const hasSetInitialRef = useRef(false);
  
  // Keep stable references for featured movies and slider items
  const featuredMoviesRef = useRef<typeof movies>([]);
  const midSliderItemsRef = useRef<Array<{
    id: string;
    title: string;
    genre: string;
    metadata: string;
    backgroundImage: string;
    video: string | undefined;
  }> | undefined>(undefined);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGenreId, setSelectedGenreId] = useState<number | undefined>(undefined);
  const [showingType, setShowingType] = useState<'now' | 'upcoming'>('now');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Fetch movies on mount - fetch first page without genre filter
  useEffect(() => {
    fetchMovies(0, 10);
  }, [fetchMovies]);

  // Store initial movies on first load (only once)
  useEffect(() => {
    if (!isLoading && movies && movies.length > 0 && !hasSetInitialRef.current) {
      initialMoviesRef.current = [...movies]; // Create a copy to prevent external mutations
      hasSetInitialRef.current = true;
      
      // Also set the featured and slider refs immediately
      featuredMoviesRef.current = initialMoviesRef.current.slice(0, 6);
      midSliderItemsRef.current = initialMoviesRef.current.slice(0, 5).map((movie) => ({
        id: String(movie.id),
        title: movie.title,
        genre: (movie.genres || [])[0]?.name || 'Featured',
        metadata: `${movie.premiereDate} ‧ ${(movie.genres || []).map((g) => g.name).join('/')} ‧ ${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`,
        backgroundImage: movie.poster,
        video: movie.teaser ?? undefined,
      }));
    }
  }, [isLoading, movies]);

  // Handle genre filter changes - fetch from backend with genre filter
  const handleCategoryChange = async (category: string) => {
    setIsFilterLoading(true);
    setSelectedCategory(category);
    try {
      // Get genre ID from genre name
      const genre = getGenreByName(category);
      const genreId = genre?.id;
      setSelectedGenreId(genreId);
      
      // Fetch first page with genre filter
      await fetchMovies(0, 10, genreId);
    } catch (e) {
      console.error('Error applying category filter', e);
    } finally {
      // slight UX delay so layout doesn't jump instantly
      setTimeout(() => setIsFilterLoading(false), 120);
    }
  };

  const handleShowingTypeChange = (type: 'now' | 'upcoming') => {
    setIsFilterLoading(true);
    const timer = setTimeout(() => {
      setShowingType(type);
      setIsFilterLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  };
  
  // Filter by premiere date on client side (backend doesn't have showing type)
  const today = new Date().toISOString().split('T')[0];
  const filteredByShowingType = movies.filter((m) => {
    const isNowShowing = m.premiereDate && m.premiereDate <= today && !m.deleted;
    const isUpcoming = m.premiereDate && m.premiereDate > today && !m.deleted;
    
    const matchesShowingType = showingType === 'now' ? isNowShowing : isUpcoming;
    return matchesShowingType;
  });

  // Track initial movies to trigger memoization updates
  const [initialMoviesCount, setInitialMoviesCount] = useState(0);

  // Update count when initial movies are loaded
  useEffect(() => {
    if (!isLoading && initialMoviesRef.current && initialMoviesCount === 0) {
      setInitialMoviesCount(initialMoviesRef.current.length);
    }
  }, [isLoading, initialMoviesCount]);

  // Use stable refs for featured movies and slider items
  const featuredMovies = featuredMoviesRef.current;
  const midSliderItems = midSliderItemsRef.current;

  return (
    <AuroraBackground>
      <AppNavbar />
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
        className="container mx-auto px-4 py-8"
      >
        {/* Mid Slider with Featured Trailers */}
        <section className="mb-12">
          <MidSlider
            isLoading={isLoading && initialMoviesCount === 0}
            items={midSliderItems}
            autoplayInterval={6000}
          />
        </section>

        {/* Toggle Now Showing / Upcoming */}
        <section className="mb-8">
          <div className="flex justify-center gap-2 md:gap-3 mb-6 flex-wrap">
            <button
              className={`px-4 md:px-6 py-2 md:py-2.5 font-semibold text-xs md:text-sm rounded-lg transition-all duration-300 border whitespace-nowrap ${
                showingType === 'now'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700/60 hover:border-slate-600 hover:text-slate-300'
              }`}
              onClick={() => handleShowingTypeChange('now')}
            >
              Now Showing
            </button>
            <button
              className={`px-4 md:px-6 py-2 md:py-2.5 font-semibold text-xs md:text-sm rounded-lg transition-all duration-300 border whitespace-nowrap ${
                showingType === 'upcoming'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700/60 hover:border-slate-600 hover:text-slate-300'
              }`}
              onClick={() => handleShowingTypeChange('upcoming')}
            >
              Upcoming Movies
            </button>
          </div>
        </section>

        {/* Filter Bar: Genre (expandable) */}
        <section className="sticky top-16 mb-10 z-40 pb-4 px-4 md:px-0">
          <div className="flex flex-col md:flex-row md:items-start md:gap-4 gap-3 p-3 md:p-4 bg-slate-900/40 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-slate-700/80">
            {/* Genre Filter */}
            <div className="flex-shrink-0 w-full md:w-auto max-w-full">
              <label className="text-xs md:text-sm font-label font-bold text-slate-300 mb-2 block">Genre</label>
              <nav className="flex flex-wrap gap-2 pb-2 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
                {/* All */}
                <button
                  key="all"
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md font-semibold border text-xs transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === ''
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-700/60 hover:text-slate-300 hover:border-slate-600'
                  }`}
                  onClick={() => handleCategoryChange('')}
                >
                  All
                </button>

                {genresLoading && genres.length === 0 ? (
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-20 bg-slate-800 rounded-full animate-pulse" />
                  ))
                ) : (
                  genres.map((g: GenreDTO) => (
                    <button
                      key={g.name}
                      className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md font-semibold border text-xs transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                        selectedCategory === g.name
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-700/60 hover:text-slate-300 hover:border-slate-600'
                      }`}
                      onClick={() => handleCategoryChange(g.name)}
                    >
                      {g.name}
                    </button>
                  ))
                )}
              </nav>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gradient-to-b from-slate-700/30 via-slate-600/50 to-slate-700/30" />

            {/* Duration and Rating Filters */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 flex-1 w-full md:w-auto">
              {/* Duration Filter */}
              <div className="flex flex-col flex-1 min-w-[120px] md:flex-initial">
                <label className="text-xs md:text-sm font-label font-bold text-slate-300 mb-2">Duration</label>
                <select className="px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 cursor-pointer w-full md:w-auto">
                  <option>All</option>
                  <option>&lt; 90 min</option>
                  <option>90-120 min</option>
                  <option>&gt; 120 min</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="flex flex-col flex-1 min-w-[120px] md:flex-initial">
                <label className="text-xs md:text-sm font-label font-bold text-slate-300 mb-2">Rating</label>
                <select className="px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 cursor-pointer w-full md:w-auto">
                  <option>All</option>
                  <option>G</option>
                  <option>PG</option>
                  <option>PG-13</option>
                  <option>R</option>
                </select>
              </div>
            </div>
          </div>
        </section>



        {/* Movies Grid */}
        <div>
          <MovieGrid movies={filteredByShowingType} isLoading={isLoading || isFilterLoading} />
        </div>

        {/* Pagination Controls */}
        <section className="mt-3 flex items-center justify-center gap-4">
          <button
            onClick={() => fetchMovies(currentPage - 1, 10, selectedGenreId)}
            disabled={currentPage === 0}
            className={`px-3 py-2 rounded-md font-semibold ${currentPage === 0 ? 'opacity-40 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
          >
            Prev
          </button>

          <div className="text-sm text-slate-300">
            Page {currentPage + 1} {totalPages > 0 ? `of ${totalPages}` : ''}
          </div>

          <button
            onClick={() => !isLastPage && fetchMovies(currentPage + 1, 10, selectedGenreId)}
            disabled={isLastPage || movies.length === 0}
            className={`px-3 py-2 rounded-md font-semibold ${isLastPage || movies.length === 0 ? 'opacity-40 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
          >
            Next
          </button>
        </section>

        {/* Featured Movies Carousel - now below grid */}
        <section className="mb-14 pt-8 pb-4 px-4 md:px-0">
          <FeaturedMoviesSection movies={featuredMovies} isLoading={isLoading && initialMoviesCount === 0} />
        </section>

      </motion.main>
      <AppFooter />
    </AuroraBackground>
  );
} 
export default MoviesPage;
