import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { usePublicMovies } from "../../hooks";
import type { MovieResponseDTO } from "../../types/auth";
import { motion } from "framer-motion";
import AppNavbar from "../../components/Layout/Navbar";
import AppFooter from "../../components/Layout/Footer";
import { AuroraBackground } from "../../components/Layout/AuroraBackground";
import { MovieHero } from "./components/MovieDetails/MovieHero";
import { MovieSynopsis } from "./components/MovieDetails/MovieSynopsis";
import { MovieGallery } from "./components/MovieDetails/MovieGallery";
import { MovieGalleryModal } from "./components/MovieDetails/MovieGalleryModal";
import { MoviesYouMayLike } from "./components/MovieDetails/MoviesYouMayLike";
import NotFoundPage from "../shared/NotFoundPage";

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { fetchMovieById, fetchMovies, movies } = usePublicMovies();
  const [movie, setMovie] = useState<MovieResponseDTO | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Generate gallery images (using poster as fallback)
  const galleryImages = movie ? [movie.poster] : [];

  // Fetch all movies on mount for related movies section
  useEffect(() => {
    fetchMovies(0, 100); // Fetch up to 100 movies for genre matching
  }, [fetchMovies]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsLoading(true);
    const fetchMovie = async () => {
      if (id) {
        const movieData = await fetchMovieById(parseInt(id));
        setMovie(movieData);
      }
      setIsLoading(false);
    };
    fetchMovie();
  }, [id, fetchMovieById]);

  // Get related movies based on genre of current movie
  const relatedMovies = useMemo(() => {
    if (!movie || !movies || movies.length === 0) return [];
    
    const movieGenreIds = movie.genres?.map(g => g.id) || [];
    if (movieGenreIds.length === 0) return [];
    
    // Filter movies that share at least one genre with current movie
    // Exclude the current movie itself and any deleted movies
    const related = movies.filter(m => 
      m.id !== movie.id && 
      !m.deleted &&
      m.genres?.some(g => movieGenreIds.includes(g.id))
    );
    
    // Sort by number of matching genres (most relevant first)
    const sorted = related.sort((a, b) => {
      const aMatchCount = a.genres?.filter(g => movieGenreIds.includes(g.id)).length || 0;
      const bMatchCount = b.genres?.filter(g => movieGenreIds.includes(g.id)).length || 0;
      return bMatchCount - aMatchCount;
    });
    
    // Limit to 6 related movies
    return sorted.slice(0, 6);
  }, [movie, movies]);

  const handleNextImage = () => {
    setSelectedImageIndex(
      (prev) => (prev + 1) % galleryImages.length
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const handleWishlist = () => {
    console.log("Added to wishlist:", movie?.id);
  };

  // Not Found State
  if (!movie) {
    return <NotFoundPage title="Movie Not Found" description="The movie you're looking for doesn't exist or has been removed." backButtonPath="/movies" />;
  }

  // Loading State
  if (isLoading) {
    return (
      <AuroraBackground>
        <AppNavbar />
        <motion.main
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
          className="flex-1 container mx-auto px-4 py-8 pt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Poster Skeleton */}
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative w-full h-[450px] rounded-2xl shadow-2xl bg-slate-800 animate-pulse"></div>
              </div>
            </div>

            {/* Details Skeleton */}
            <div className="lg:col-span-2 flex flex-col justify-start space-y-4">
              <div className="h-12 bg-slate-800 rounded-lg animate-pulse mb-4"></div>

              <div className="flex flex-wrap gap-2 mb-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-24 bg-slate-800 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>

              <div className="h-80 bg-slate-800 rounded-lg animate-pulse mb-4"></div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-slate-800 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 h-12 bg-slate-800 rounded-lg animate-pulse"></div>
                <div className="flex-1 h-12 bg-slate-800 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </motion.main>
        <AppFooter />
      </AuroraBackground>
    );
  }

  // Main Content
  return (
    <AuroraBackground>
      <AppNavbar />
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
        className="flex-1 container mx-auto px-4 py-8 pt-24"
      >
        <MovieHero movie={movie} onWishlistClick={handleWishlist} />
        <MovieSynopsis description={movie.description} />
        <MovieGallery
          galleryImages={galleryImages}
          onImageClick={(index) => {
            setSelectedImageIndex(index);
            setIsModalOpen(true);
          }}
        />
        {relatedMovies.length > 0 && <MoviesYouMayLike movies={relatedMovies} />}
      </motion.main>

      <MovieGalleryModal
        isOpen={isModalOpen}
        galleryImages={galleryImages}
        selectedImageIndex={selectedImageIndex}
        onClose={() => setIsModalOpen(false)}
        onNextImage={handleNextImage}
        onPrevImage={handlePrevImage}
        onImageSelect={setSelectedImageIndex}
      />

      <AppFooter />
    </AuroraBackground>
  );
}
