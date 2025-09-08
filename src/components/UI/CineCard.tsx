import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@heroui/react";
import { Link } from "react-router-dom";
import { CineButton } from "./CineButton";

// Direction-aware hover effect (kept for subtle movement, but can be removed for static)
const variants = {
  initial: { x: 0, y: 0 },
  exit: { x: 0, y: 0 },
  top: { y: 10 },
  bottom: { y: -10 },
  left: { x: 10 },
  right: { x: -10 },
};
const textVariants = {
  initial: { y: 0, x: 0, opacity: 0 },
  exit: { y: 0, x: 0, opacity: 0 },
  top: { y: -10, opacity: 1 },
  bottom: { y: 2, opacity: 1 },
  left: { x: -2, opacity: 1 },
  right: { x: 10, opacity: 1 },
};

function DirectionAwareHoverCard({
  imageUrl,
  children,
  button,
  onClick,
  className,
  imageClassName,
}: {
  imageUrl: string;
  children: React.ReactNode;
  button?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  imageClassName?: string;
  childrenClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right" | string
  >("left");

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!ref.current) return;
    const { width: w, height: h, left, top } = ref.current.getBoundingClientRect();
    const x = event.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = event.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    switch (d) {
      case 0: setDirection("top"); break;
      case 1: setDirection("right"); break;
      case 2: setDirection("bottom"); break;
      case 3: setDirection("left"); break;
      default: setDirection("left"); break;
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      className={
        "relative group/card rounded-2xl overflow-hidden cursor-pointer shadow-2xl transition-all bg-gradient-to-br from-indigo-900 via-pink-900 to-indigo-700 " +
        (className || "")
      }
      style={{ minHeight: "22rem", minWidth: "16rem" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-full w-full"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          {/* Subtle dark overlay for readability */}
          <motion.div className="absolute inset-0 w-full h-full bg-black/40 z-10 transition duration-500" />
          <motion.div
            variants={variants}
            className="h-full w-full relative"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <img
              alt="card"
              className={
                "h-80 w-full object-cover scale-[1.10] transition-all duration-300 " +
                (imageClassName || "")
              }
              width="1000"
              height="1000"
              src={imageUrl}
            />
          </motion.div>
          {/* Text block with background blur and padding for readability */}
          <motion.div
            variants={textVariants}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={
              "absolute bottom-4 left-4 right-4 z-40 pointer-events-none"
            }
          >
            <div className="bg-black/60 rounded-xl px-4 py-3 backdrop-blur-md">
              {children}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      {/* CineButton always visible and clickable, now at top right */}
      {button && (
        <div className="absolute top-4 right-4 z-50">
          {button}
        </div>
      )}
    </motion.div>
  );
}

export interface CineCardProps {
  id?: string;
  title: string;
  poster?: string; // for movies
  src?: string;    // for events/news
  description?: string;
  releaseDate?: string;
  showBookButton?: boolean;
  bookButtonLink?: string;
  bookButtonLabel?: string;
  disabled?: boolean;
}

export function CineCard(props: CineCardProps) {
  const {
    title,
    poster,
    src,
    description,
    releaseDate,
    showBookButton = false,
    bookButtonLink = "",
    bookButtonLabel = "Book Now",
    disabled = false,
  } = props;

  return (
    <DirectionAwareHoverCard
      imageUrl={poster || src || ""}
      button={
        showBookButton ? (
          <CineButton
            as={Link}
            to={bookButtonLink}
            className="w-full"
            disabled={disabled}
          >
            {bookButtonLabel}
          </CineButton>
        ) : (
          <CineButton className="w-full" disabled>
            Coming Soon
          </CineButton>
        )
      }
    >
      <div className="flex flex-col gap-1">
        <div className="font-extrabold text-xl md:text-2xl text-white drop-shadow">
          {title}
        </div>
        {releaseDate && (
          <Badge color="warning" className="mb-1 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.15)" }}>
            {new Date(releaseDate).toLocaleDateString()}
          </Badge>
        )}
        {description && (
          <div className="text-pink-100 text-sm md:text-base mb-1 font-medium leading-snug">
            {description}
          </div>
        )}
      </div>
    </DirectionAwareHoverCard>
  );
}