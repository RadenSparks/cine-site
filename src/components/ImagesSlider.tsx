"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
}: {
  images: string[];
  children?: React.ReactNode;
  overlay?: boolean;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [hovered, setHovered] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const loaders = images.map(
      (src) =>
        new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(src);
          img.onerror = () => reject(src);
        })
    );

    Promise.allSettled(loaders).then((results) => {
      if (!mountedRef.current) return;
      const ok = results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
        .map((r) => r.value);
      setLoadedImages(ok);
      setLoading(false);
    });
  }, [images]);

  // autoplay with pause on hover / focus
  useEffect(() => {
    if (!autoplay || loadedImages.length === 0) return;
    if (hovered) return;
    const id = setInterval(() => {
      setCurrentIndex((s) => (s + 1) % loadedImages.length);
    }, 5200);
    return () => clearInterval(id);
  }, [autoplay, hovered, loadedImages.length]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setCurrentIndex((s) => (s + 1) % loadedImages.length);
      if (e.key === "ArrowLeft") setCurrentIndex((s) => (s - 1 + loadedImages.length) % loadedImages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loadedImages.length]);

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  const slideVariants = {
    initial: { scale: 0.98, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6 },
    },
    upExit: { opacity: 0, y: "-12%", transition: { duration: 0.7 } },
    downExit: { opacity: 0, y: "12%", transition: { duration: 0.7 } },
  };

  const areImagesLoaded = loadedImages.length > 0 && !loading;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl select-none",
        // responsive height: poster/hero friendly
        "h-[420px] sm:h-[520px] md:h-[620px] lg:h-[720px]",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-roledescription="carousel"
    >
      {/* background / children slot sits above images for template-like overlay content */}
      {areImagesLoaded && children && (
        <div className="absolute inset-0 z-30 pointer-events-none">{children}</div>
      )}

      {/* subtle overlay to darken image for legible content */}
      {areImagesLoaded && overlay && (
        <div
          className={cn(
            "absolute inset-0 z-20 bg-gradient-to-tr from-black/70 via-black/30 to-transparent",
            overlayClassName
          )}
        />
      )}

      {/* image area */}
      <div className="absolute inset-0 z-10">
        <AnimatePresence initial={false} mode="wait">
          {areImagesLoaded ? (
            <motion.img
              key={currentIndex}
              src={loadedImages[currentIndex]}
              alt={`slide-${currentIndex + 1}`}
              initial="initial"
              animate="visible"
              exit={direction === "up" ? "upExit" : "downExit"}
              variants={slideVariants}
              className="absolute inset-0 w-full h-full object-cover object-center"
              draggable={false}
            />
          ) : (
            // fallback simple loading state
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900"
            >
              <div className="text-white/70">Loading images…</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* indicators (dots) centered at bottom — accessible, keyboard focusable */}
      {areImagesLoaded && loadedImages.length > 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-40 flex items-center gap-2">
          {loadedImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentIndex}
              onClick={() => handleSelect(i)}
              className={cn(
                "w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-transform duration-200",
                i === currentIndex ? "bg-white scale-110 shadow-lg" : "bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      )}

      {/* small caption container pinned bottom-left (content slot recommended instead) */}
      <div className="absolute left-6 bottom-6 z-50 pointer-events-none hidden sm:block">
        {/* consumer can pass children to render buttons/captions — left empty here for layout */}
      </div>
    </div>
  );
};