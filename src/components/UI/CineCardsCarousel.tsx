import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CineButton } from "./CineButton";

interface CineCardData {
  category: string;
  title: string;
  src: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

export function CineCardsCarousel({ cards }: { cards: CineCardData[] }) {
  const [active, setActive] = useState(0);

  const variants = {
    initial: { opacity: 0, scale: 0.95, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.95, y: -40, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-3xl md:text-5xl font-bold text-white font-sans mb-8">
        Featured & News
      </h2>
      <div className="relative max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={cards[active].src}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className="bg-gradient-to-br from-indigo-900 via-pink-900 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center"
          >
            <img
              src={cards[active].src}
              alt={cards[active].title}
              className="md:w-1/2 w-full h-80 object-cover object-center rounded-3xl"
            />
            <div className="flex-1 p-8 flex flex-col justify-center items-start">
              <span className="uppercase text-xs font-semibold text-pink-400 mb-2 tracking-widest">
                {cards[active].category}
              </span>
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                {cards[active].title}
              </h3>
              <p className="text-base md:text-lg text-gray-200 mb-6">
                {cards[active].description}
              </p>
              {cards[active].actionLabel && cards[active].actionLink && (
                <CineButton as="a" href={cards[active].actionLink} className="mt-2">
                  {cards[active].actionLabel}
                </CineButton>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Carousel Controls */}
        <div className="flex justify-center gap-2 mt-8">
          {cards.map((card, idx) => (
            <button
              key={card.src}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                active === idx
                  ? "bg-pink-500 border-white scale-110"
                  : "bg-white/40 border-pink-500"
              }`}
              onClick={() => setActive(idx)}
              aria-label={`Go to card ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}