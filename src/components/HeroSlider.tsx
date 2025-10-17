import React, { useEffect, useRef, useState } from "react";
import { Chip } from "@heroui/react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { type RootState } from "../store";
// replace @heroui Button with your CineButton
import { CineButton } from "./UI/CineButton";

interface Movie {
  id: string;
  title: string;
  poster: string;
  description?: string;
  releaseDate?: string;
}

export default function HeroSlider() {
  const movies = useSelector((s: RootState) => s.movies.list) as Movie[] | undefined;
  const slides = (Array.isArray(movies) ? movies : []).slice(0, 4);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const count = slides.length;
  const touchStartX = useRef<number | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!count) return;
    const interval = setInterval(() => {
      if (!hovered && mounted.current) {
        setActive((s) => (s + 1) % count);
      }
    }, 5200);
    return () => clearInterval(interval);
  }, [count, hovered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((s) => (s + 1) % count);
      if (e.key === "ArrowLeft") setActive((s) => (s - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches?.[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? 0;
    const dx = endX - touchStartX.current;
    const threshold = 40;
    if (dx > threshold) {
      setActive((s) => (s - 1 + count) % count);
    } else if (dx < -threshold) {
      setActive((s) => (s + 1) % count);
    }
    touchStartX.current = null;
  };

  if (!count) return null;

  const slideVariants = {
    initial: { scale: 0.98, opacity: 0, y: 16 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
    },
    exitUp: { opacity: 0, y: -12, transition: { duration: 0.6 } },
    exitDown: { opacity: 0, y: 12, transition: { duration: 0.6 } },
  };

  return (
    <div className="mb-12">
      <div
        className="relative w-full overflow-hidden rounded-2xl select-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
      >
        <div className="relative h-[420px] sm:h-[520px] md:h-[620px] lg:h-[720px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={slides[active].id}
              src={slides[active].poster}
              alt={slides[active].title}
              initial="initial"
              animate="visible"
              exit={hovered ? "exitDown" : "exitUp"}
              variants={slideVariants}
              className="absolute inset-0 w-full h-full object-cover object-center"
              draggable={false}
            />
          </AnimatePresence>

          {/* stronger cinematic overlay for contrast */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* content */}
          <div className="absolute left-6 sm:left-10 md:left-14 bottom-8 sm:bottom-16 z-20 max-w-xl text-white">
            <Chip color="primary" className="mb-3">Featured</Chip>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3 drop-shadow">
              {slides[active].title}
            </h2>
            {slides[active].description && (
              <p className="hidden sm:block text-lg text-white/90 mb-5 max-w-[40rem]">
                {slides[active].description}
              </p>
            )}
            <div className="flex items-center gap-3">
              <CineButton as={Link} to={`/movie/${slides[active].id}`} className="shadow-lg">
                Book Now
              </CineButton>
              <CineButton as="a" href={`#trailer-${slides[active].id}`} className="!bg-white/6 ">
                Watch Trailer
              </CineButton>
            </div>
          </div>

          {/* centered indicators (no arrows) */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-30 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === active}
                onClick={() => setActive(idx)}
                className={`w-3.5 h-3.5 rounded-full transition-transform duration-200 ${
                  idx === active ? "bg-white scale-110 shadow-lg" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}