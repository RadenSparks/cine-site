import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface MovieGalleryModalProps {
  isOpen: boolean;
  galleryImages: string[];
  selectedImageIndex: number;
  onClose: () => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  onImageSelect: (index: number) => void;
}

export function MovieGalleryModal({
  isOpen,
  galleryImages,
  selectedImageIndex,
  onClose,
  onNextImage,
  onPrevImage,
  onImageSelect,
}: MovieGalleryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl"
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 cursor-target"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>

            {/* Main Image */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[selectedImageIndex]}
                alt={`Gallery Image ${selectedImageIndex + 1}`}
                className="w-full h-auto object-cover max-h-[70vh]"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 gap-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPrevImage();
                }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 cursor-target"
              >
                <ChevronLeftIcon className="w-6 h-6 text-white" />
              </button>

              {/* Image Counter */}
              <div className="text-white text-center flex-1">
                <p className="font-semibold">
                  {selectedImageIndex + 1} / {galleryImages.length}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onNextImage();
                }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 cursor-target"
              >
                <ChevronRightIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
              {galleryImages.map((imageUrl, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onImageSelect(index);
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex
                      ? "border-pink-500 ring-2 ring-pink-400"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
