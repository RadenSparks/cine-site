import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import gsap from "gsap";

interface Movie {
  id: string;
  title: string;
  poster: string;
  genres?: string[];
}

interface MoviesYouMayLikeProps {
  movies: Movie[];
}

export function MoviesYouMayLike({ movies }: MoviesYouMayLikeProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredArrow, setHoveredArrow] = useState<"prev" | "next" | null>(null);
  const [direction, setDirection] = useState(1);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const genresRef = useRef<HTMLParagraphElement>(null);

  const moviesLength = useMemo(() => movies.length, [movies.length]);
  const activeMovie = useMemo(() => movies[activeIndex], [activeIndex, movies]);

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, []);

  const updateMovie = useCallback(
    (dir: number) => {
      setDirection(dir);
      setActiveIndex((prev) => (prev + dir + moviesLength) % moviesLength);
    },
    [moviesLength]
  );

  const handleNext = useCallback(() => {
    updateMovie(1);
    stopAutoplay();
  }, [updateMovie, stopAutoplay]);

  const handlePrev = useCallback(() => {
    updateMovie(-1);
    stopAutoplay();
  }, [updateMovie, stopAutoplay]);

  // Animate images with GSAP (CircularTestimonials style)
  const animateImages = useCallback(() => {
    if (!imageContainerRef.current) return;

    const containerWidth = imageContainerRef.current.offsetWidth;
    const maxStickUp = containerWidth * 0.15;

    movies.forEach((_, index) => {
      const img = imageContainerRef.current!.querySelector(
        `[data-movie-index="${index}"]`
      ) as HTMLElement;
      if (!img) return;

      let offset = index - activeIndex;
      if (offset > moviesLength / 2) offset -= moviesLength;
      if (offset < -moviesLength / 2) offset += moviesLength;

      const zIndex = moviesLength - Math.abs(offset);
      const opacity = offset === 0 ? 1 : 0.5;
      const scale = offset === 0 ? 1 : 0.8;

      let translateX = "0%";
      let translateY = "0%";
      let rotateY = 0;

      if (offset > 0) {
        translateX = "25%";
        translateY = `-${(maxStickUp / img.offsetHeight) * 100}%`;
        rotateY = -20;
      } else if (offset < 0) {
        translateX = "-25%";
        translateY = `-${(maxStickUp / img.offsetHeight) * 100}%`;
        rotateY = 20;
      }

      gsap.to(img, {
        zIndex,
        opacity,
        scale,
        x: translateX,
        y: translateY,
        rotateY,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  }, [activeIndex, moviesLength, movies]);

  // Wrap and animate text
  const wrapLines = (element: HTMLElement, text: string) => {
    element.innerHTML = "";
    const parent = document.createElement("div");
    parent.style.overflow = "hidden";
    const child = document.createElement("div");
    child.textContent = text;
    parent.appendChild(child);
    element.appendChild(parent);
    return child;
  };

  const animateTitleAndGenres = useCallback(() => {
    if (!titleRef.current || !genresRef.current) return;

    const titleChild = wrapLines(titleRef.current, activeMovie.title);
    const genresChild = wrapLines(
      genresRef.current,
      activeMovie.genres?.join(" • ") || "Entertainment"
    );

    const fromY = direction === 1 ? -50 : 50;

    gsap.fromTo(
      titleChild,
      { yPercent: fromY, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
    );
    gsap.fromTo(
      genresChild,
      { yPercent: fromY, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
        delay: 0.1,
      }
    );
  }, [activeMovie, direction]);

  // Animate on index change
  useEffect(() => {
    animateImages();
    animateTitleAndGenres();
  }, [activeIndex, animateImages, animateTitleAndGenres]);

  // Autoplay
  useEffect(() => {
    autoplayIntervalRef.current = setInterval(() => {
      updateMovie(1);
    }, 6000);
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
      gsap.killTweensOf("[data-movie-index]");
    };
  }, [updateMovie]);

  if (movies.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="mb-12 py-8"
    >
      {/* Header */}
      <div className="mb-12 relative z-10">
        <div className="bg-slate-900/70 p-4 rounded-lg border border-purple-400/30 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300">
            Movies You May Like
          </h2>
        </div>
        <p className="text-cyan-200 text-sm sm:text-base font-semibold drop-shadow-lg px-4 relative z-10">
          Discover more amazing titles based on your interests
        </p>
      </div>

      {/* Main Carousel Container - CircularTestimonials Style */}
      <div className="relative pt-16" style={{ perspective: "1000px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start lg:items-center">
          {/* Image Carousel */}
          <div className="lg:order-1 order-2">
            <div
              ref={imageContainerRef}
              className="relative w-full h-80 sm:h-96"
              style={{ perspective: "1000px" }}
            >
              <AnimatePresence mode="wait">
                {movies.map((movie, index) => {
                  let offset = index - activeIndex;
                  if (offset > moviesLength / 2) offset -= moviesLength;
                  if (offset < -moviesLength / 2) offset += moviesLength;

                  return (
                    <div
                      key={movie.id}
                      data-movie-index={index}
                      className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                      style={{
                        width: "75%",
                        height: "100%",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: moviesLength - Math.abs(offset),
                        opacity: offset === 0 ? 1 : 0.5,
                      }}
                      onClick={() => {
                        navigate(`/movie/${movie.id}`);
                      }}
                    >
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Text & Controls */}
          <div className="lg:order-2 order-1 flex flex-col gap-6">
            {/* Title */}
            <div className="min-h-16">
              <h3
                ref={titleRef}
                className="text-3xl sm:text-4xl font-bold text-white leading-tight"
              >
                {activeMovie.title}
              </h3>
            </div>

            {/* Genres */}
            <div className="min-h-8">
              <p
                ref={genresRef}
                className="text-cyan-300 text-sm sm:text-base font-semibold drop-shadow-md"
              >
                {activeMovie.genres?.join(" • ") || "Entertainment"}
              </p>
            </div>

            {/* Movie Stats */}
            <motion.div
              key={`stats-${activeIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { label: "Rating", value: "8.5/10" },
                { label: "Popularity", value: "High" },
                { label: "Release", value: "2024" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-white/10 rounded-lg p-3 backdrop-blur-sm"
                >
                  <p className="text-slate-200 text-xs font-semibold drop-shadow-md">
                    {stat.label}
                  </p>
                  <p className="text-white text-sm font-bold mt-1">{stat.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Navigation Controls */}
            <div className="flex flex-col gap-4 pt-2">
              {/* Arrows */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 transition-colors text-white text-sm font-medium backdrop-blur-sm border border-white/10"
                  onMouseEnter={() => setHoveredArrow("prev")}
                  onMouseLeave={() => setHoveredArrow(null)}
                >
                  <ChevronLeftIcon
                    className="w-4 h-4 transition-transform"
                    style={{
                      transform:
                        hoveredArrow === "prev"
                          ? "translateX(-2px)"
                          : "translateX(0)",
                    }}
                  />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 transition-colors text-white text-sm font-medium backdrop-blur-sm border border-white/10"
                  onMouseEnter={() => setHoveredArrow("next")}
                  onMouseLeave={() => setHoveredArrow(null)}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRightIcon
                    className="w-4 h-4 transition-transform"
                    style={{
                      transform:
                        hoveredArrow === "next"
                          ? "translateX(2px)"
                          : "translateX(0)",
                    }}
                  />
                </button>
              </div>

              {/* Indicators */}
              <div className="flex gap-2 overflow-x-auto">
                {movies.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setDirection(index > activeIndex ? 1 : -1);
                      setActiveIndex(index);
                    }}
                    className="flex-shrink-0 rounded-full transition-all"
                    style={{
                      width: index === activeIndex ? "24px" : "6px",
                      height: "6px",
                      backgroundColor:
                        index === activeIndex
                          ? "rgb(168, 85, 247)"
                          : "rgb(71, 85, 105)",
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MoviesYouMayLike;
