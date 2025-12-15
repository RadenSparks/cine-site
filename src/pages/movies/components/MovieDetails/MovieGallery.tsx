import { motion } from "framer-motion";
import BentoGrid from "../../../../components/UI/BentoGrid";

interface MovieGalleryProps {
  galleryImages: string[];
  onImageClick: (index: number) => void;
}

export function MovieGallery({ galleryImages, onImageClick }: MovieGalleryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mb-16"
    >
      <div className="bg-slate-900/70 p-4 rounded-lg border border-purple-400/30 mb-6">
        <h2 className="text-2xl font-title font-bold text-white">Movie Gallery</h2>
      </div>
      <BentoGrid
        mainAspect="4/3"
        leftColRatio={0.55}
        rightCol1={1}
        rightCol2={1}
        topRowRatio={0.6}
        bottomRowRatio={0.4}
        gap="12px"
        gridHeight="500px"
        cellBackground="transparent"
        cellBorderColor="transparent"
        cellBorderRadius="12px"
        cellBorderWidth="0px"
        cellPadding="0px"
        main={
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full h-full group cursor-pointer relative overflow-hidden rounded-xl"
            onClick={() => onImageClick(0)}
          >
            <img
              src={galleryImages[0]}
              alt="Featured Gallery Image 1"
              className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white font-semibold">Featured Scene</p>
            </div>
          </motion.div>
        }
        topCenter={
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full h-full group cursor-pointer relative overflow-hidden rounded-xl"
            onClick={() => onImageClick(1)}
          >
            <img
              src={galleryImages[1]}
              alt="Gallery Image 2"
              className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white font-semibold text-sm font-label">Scene 2</p>
            </div>
          </motion.div>
        }
        topRight={
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full h-full group cursor-pointer relative overflow-hidden rounded-xl"
            onClick={() => onImageClick(2)}
          >
            <img
              src={galleryImages[2]}
              alt="Gallery Image 3"
              className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white font-semibold text-sm font-label">Scene 3</p>
            </div>
          </motion.div>
        }
        bottom={
          <div className="w-full h-full grid grid-cols-4 gap-3">
            {galleryImages.slice(3).map((imageUrl, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full h-full group cursor-pointer relative overflow-hidden rounded-lg"
                onClick={() => onImageClick(index + 3)}
              >
                <img
                  src={imageUrl}
                  alt={`Gallery ${index + 4}`}
                  className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white font-semibold text-xs font-label">
                    Scene {index + 4}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        }
      />
    </motion.div>
  );
}
