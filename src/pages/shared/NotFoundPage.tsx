import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { AuroraBackground } from '../../components/Layout/AuroraBackground';
import AppNavbar from '../../components/Layout/Navbar';
import AppFooter from '../../components/Layout/Footer';

interface NotFoundPageProps {
  title?: string;
  description?: string;
  backButtonText?: string;
  backButtonPath?: string;
}

export default function NotFoundPage({
  title = 'Movie Not Found',
  description = 'The movie you\'re looking for doesn\'t exist or has been removed.',
  backButtonText = 'Back to Movies',
  backButtonPath = '/movies'
}: NotFoundPageProps) {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <AuroraBackground>
      <AppNavbar />
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center min-h-screen"
      >
        <div className="w-full max-w-2xl">
          {/* 404 Error Code */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <motion.h1 
              className="text-9xl md:text-9xl lg:text-[180px] font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent mb-4 drop-shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              404
            </motion.h1>
            <div className="h-2 w-40 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 mx-auto rounded-full mb-8 shadow-lg shadow-purple-500/50"></div>
          </motion.div>

          {/* Title */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-6"
          >
            <h2 className="text-4xl md:text-6xl font-title font-bold text-white mb-4 drop-shadow-lg">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-slate-100 leading-relaxed max-w-xl mx-auto drop-shadow-md font-body">
              {description}
            </p>
          </motion.div>

          {/* Decorative Icons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-8 my-12 text-5xl opacity-50"
          >
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎬
            </motion.span>
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              🎞️
            </motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              📽️
            </motion.span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={() => navigate(backButtonPath)}
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transition-all"
            >
              {backButtonText}
            </motion.button>

            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-slate-800/50 border border-white/20 text-white font-semibold rounded-lg hover:bg-slate-700/50 hover:border-white/40 transition-all backdrop-blur-sm"
            >
              Go to Home
            </motion.button>
          </motion.div>

          {/* Help Text */}
          <motion.div
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <p className="text-slate-200 text-sm md:text-base font-semibold mb-3 drop-shadow-md font-label">
              What you can try:
            </p>
            <ul className="text-slate-100 text-sm md:text-base space-y-2 max-w-md mx-auto drop-shadow-md font-body">
              <li>✓ Check the URL for typos</li>
              <li>✓ Browse our complete movie collection</li>
              <li>✓ Use the search feature to find your movie</li>
            </ul>
          </motion.div>
        </div>
      </motion.main>
      <AppFooter />
    </AuroraBackground>
  );
}
