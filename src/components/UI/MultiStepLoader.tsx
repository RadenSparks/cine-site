"use client";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

const CheckFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40 px-8 py-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden h-80">
      <div className="relative h-full flex flex-col justify-center">
        {loadingStates.map((loadingState, index) => {
          const opacity = index <= value ? 1 : 0.3;
          // Smooth scrolling: items move up as progress continues
          const translateY = Math.max(0, index - value) * 80;

          return (
            <motion.div
              key={index}
              className={cn("text-left flex gap-4 py-4 flex-shrink-0")}
              initial={{ opacity: 0, y: 40 }}
              animate={{ 
                opacity: opacity, 
                y: -translateY,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="flex-shrink-0 pt-1">
                {index < value && (
                  <CheckFilled className="w-8 h-8 text-white/80" />
                )}
                {index === value && (
                  <CheckFilled className="w-8 h-8 text-lime-400 animate-pulse" />
                )}
                {index > value && (
                  <CheckIcon className="w-8 h-8 text-white/50" />
                )}
              </div>
              <span
                className={cn(
                  "text-lg sm:text-xl font-medium transition-colors pt-1",
                  index <= value
                    ? value === index
                      ? "text-lime-300 font-semibold"
                      : "text-white/80"
                    : "text-white/50"
                )}
              >
                {loadingState.text}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Blur overlay for top - hides scrolled items */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-t-2xl" />

      {/* Blur overlay for bottom - hides upcoming items */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/10 via-white/5 to-transparent pointer-events-none rounded-b-2xl" />
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-3xl bg-black/40"
        >
          <div className="h-96 relative">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>

          <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-gradient-to-b from-black/0 to-black/60 h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
