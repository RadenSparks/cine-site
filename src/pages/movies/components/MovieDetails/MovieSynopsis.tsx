import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface MovieSynopsisProps {
  description?: string;
}

export function MovieSynopsis({ description }: MovieSynopsisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mb-16"
    >
      <div className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 border border-white/10 rounded-2xl backdrop-blur-sm p-8">
        <div className="flex items-center gap-3 mb-4 bg-slate-900/70 p-4 rounded-lg border border-pink-400/30">
          <SparklesIcon className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold text-white">Synopsis</h2>
        </div>
        <p className="text-indigo-100 text-lg leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
