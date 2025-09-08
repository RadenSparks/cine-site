import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Chip, Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Movie {
  id: string;
  title: string;
  poster: string;
  description: string;
}

export default function HeroSlider({ movies }: { movies: Movie[] }) {
  const [active, setActive] = useState(0);
  const count = movies.length;
  if (!count) return null;

  function prev() {
    setActive((prev) => (prev === 0 ? count - 1 : prev - 1));
  }
  function next() {
    setActive((prev) => (prev === count - 1 ? 0 : prev + 1));
  }

  const slideVariants = {
    initial: {
      scale: 0.95,
      opacity: 0,
      rotateX: 45,
    },
    visible: {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: ["easeInOut"],
      },
    },
    exit: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="mb-12">
      <div className="relative w-full h-[40rem] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {/* Animated Image Slider */}
        <AnimatePresence mode="wait">
          <motion.img
            key={movies[active].id}
            src={movies[active].poster}
            alt={movies[active].title}
            initial="initial"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 z-10" />
        {/* Content Overlay */}
        <div className="absolute left-8 bottom-16 text-white max-w-xl drop-shadow-lg z-20">
          <Chip color="primary" className="mb-2">Featured</Chip>
          <h2 className="text-5xl font-extrabold mb-4">{movies[active].title}</h2>
          <p className="text-xl mb-6">{movies[active].description}</p>
          <Button as={Link} to={`/movie/${movies[active].id}`} color="success" size="lg" className="shadow-lg">
            Book Now
          </Button>
        </div>
        {/* Navigation Arrows */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-700 to-pink-600 text-white rounded-full p-2 shadow-lg z-30"
          onClick={prev}
          aria-label="Previous"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-700 to-pink-600 text-white rounded-full p-2 shadow-lg z-30"
          onClick={next}
          aria-label="Next"
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {movies.map((_, idx) => (
            <button
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${active === idx ? 'bg-pink-500 border-white scale-110' : 'bg-white/40 border-pink-500'}`}
              onClick={() => setActive(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}