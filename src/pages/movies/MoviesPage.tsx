import AppNavbar from '../../components/Layout/Navbar';
import AppFooter from '../../components/Layout/Footer';
import { AuroraBackground } from '../../components/Layout/AuroraBackground';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import FeaturedMoviesSection from './components/FeaturedMoviesSection';
import MidSlider from './components/MidSlider';
import MovieGrid from './components/MovieGrid';
import { useMovies } from '../../hooks';

// Get unique categories from movie genres
const getCategories = (movies: Array<{ genres?: string[] }>): string[] => {
  const cats = new Set<string>();
  movies.forEach((m) => (m.genres || []).forEach((g: string) => cats.add(g)));
  return Array.from(cats);
};

// Movie List Page (was MoviesPage)
export function MoviesPage() {
  const { movies, isLoading } = useMovies();
  const categories = getCategories(movies);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || '');
  const [showingType, setShowingType] = useState<'now' | 'upcoming'>('now');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Handle filter changes with loading animation
  const handleCategoryChange = (category: string) => {
    setIsFilterLoading(true);
    const timer = setTimeout(() => {
      setSelectedCategory(category);
      setIsFilterLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  };

  const handleShowingTypeChange = (type: 'now' | 'upcoming') => {
    setIsFilterLoading(true);
    const timer = setTimeout(() => {
      setShowingType(type);
      setIsFilterLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  };
  // For demo, filter by releaseDate: if releaseDate is in the past, it's 'now', else 'upcoming'.
  const today = new Date();
  const filteredMovies = movies.filter((m) => {
    const release = new Date(m.releaseDate!);
    if (showingType === 'now') {
      return release <= today && (m.genres || []).includes(selectedCategory);
    } else {
      return release > today && (m.genres || []).includes(selectedCategory);
    }
  });

  // Memoize featured movies so they don't refresh when filters change
  const featuredMovies = useMemo(() => 
    movies.slice(0, 6), 
    [movies]
  );

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
            isLoading={isLoading}
            items={!isLoading ? movies?.slice(0, 5).map((movie) => ({
              id: movie.id,
              title: movie.title,
              genre: (movie.genres || [])[0] || 'Featured',
              metadata: `${movie.releaseDate} ‧ ${(movie.genres || []).join('/')} ‧ ${movie.duration || '2h'}`,
              backgroundImage: movie.poster,
              video: movie.video,
            })) || undefined : undefined}
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
              <label className="text-xs md:text-sm font-bold text-slate-300 mb-2 block">Genre</label>
              <nav className="flex flex-wrap gap-2 pb-2 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
                {categories.map((cat: string) => (
                  <button
                    key={cat}
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md font-semibold border text-xs transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-700/60 hover:text-slate-300 hover:border-slate-600'
                    }`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gradient-to-b from-slate-700/30 via-slate-600/50 to-slate-700/30" />

            {/* Duration and Rating Filters */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 flex-1 w-full md:w-auto">
              {/* Duration Filter */}
              <div className="flex flex-col flex-1 min-w-[120px] md:flex-initial">
                <label className="text-xs md:text-sm font-bold text-slate-300 mb-2">Duration</label>
                <select className="px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 cursor-pointer w-full md:w-auto">
                  <option>All</option>
                  <option>&lt; 90 min</option>
                  <option>90-120 min</option>
                  <option>&gt; 120 min</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="flex flex-col flex-1 min-w-[120px] md:flex-initial">
                <label className="text-xs md:text-sm font-bold text-slate-300 mb-2">Rating</label>
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
        <div className="min-h-screen">
          <MovieGrid movies={filteredMovies} isLoading={isLoading || isFilterLoading} />
        </div>

        {/* Featured Movies Carousel - now below grid */}
        <section className="mb-14 pt-8 pb-4 px-4 md:px-0">
          <FeaturedMoviesSection movies={featuredMovies} />
        </section>

      </motion.main>
      <AppFooter />
    </AuroraBackground>
  );
} 
export default MoviesPage;
