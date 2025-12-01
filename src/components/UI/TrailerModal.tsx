import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

interface TrailerModalProps {
  isOpen: boolean;
  videoUrl?: string;
  title?: string;
  onClose: () => void;
}

export function TrailerModal({
  isOpen,
  videoUrl,
  title = "Movie Trailer",
  onClose,
}: TrailerModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);
  return (
    <AnimatePresence>
      {isOpen && videoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 pointer-events-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl pointer-events-auto"
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="cursor-target absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm"
              aria-label="Close trailer"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>

            {/* Trailer Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl cursor-target">
              {/* Title */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6 pt-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {title}
                </h3>
              </div>

              {/* Video Container */}
              <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
                <iframe
                  src={videoUrl + "?autoplay=1&modestbranding=1&rel=0&controls=1"}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-2xl"
                  style={{ pointerEvents: "auto" }}
                />
              </div>

              {/* Info Footer */}
              <div className="bg-gradient-to-t from-black to-transparent p-6 pb-8">
                <p className="text-white/80 text-sm">
                  Press ESC or click outside to close
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
