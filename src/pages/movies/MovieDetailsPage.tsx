import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMovies } from "../../hooks";
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

const galleryImages = [
  "https://image.tmdb.org/t/p/w342/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
  "https://image.tmdb.org/t/p/w342/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  "https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "https://image.tmdb.org/t/p/w342/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
  "https://image.tmdb.org/t/p/w342/6bCplVkhowCjTHXWv49UjRPn0eK.jpg",
  "https://image.tmdb.org/t/p/w342/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  "https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
];

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { movies, getMovieById } = useMovies();
  const movie = getMovieById(id || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [id]);

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

  // Get related movies (same genre)
  const relatedMovies = movies
    .filter(
      (m) =>
        m.id !== movie.id &&
        m.genres &&
        movie.genres &&
        m.genres.some((genre) => movie.genres!.includes(genre))
    )
    .slice(0, 4);

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
        <MoviesYouMayLike movies={relatedMovies} />
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
