import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { motion } from "framer-motion";

import AppNavbar from '../components/Layout/Navbar';
import AppFooter from '../components/Layout/Footer';
import HeroSlider from '../components/HeroSlider';
import NowShowingSection from '../components/NowShowingSection';
import HotTrailerSection from '../components/HotTrailerSection';
import GiftPromotionsSection from '../components/GiftPromotionsSection';
import ComingSoonSection from '../components/ComingSoonSection';
import { CineCardsCarousel } from '../components/UI/CineCardsCarousel';
import { AuroraBackground } from "../components/Layout/AuroraBackground";

const newsCards = [
  {
    category: "Premiere",
    title: "Premiere Night: Inception",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    description: "Join us for the exclusive premiere of Inception!",
    actionLabel: "Book Tickets",
    actionLink: "/movie/9"
  },
  {
    category: "Festival",
    title: "Kids Animation Festival",
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    description: "A weekend of fun for the whole family.",
    actionLabel: "See Details",
    actionLink: "/events/animation-festival"
  },
  {
    category: "Q&A",
    title: "Director Q&A: The Dark Knight",
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    description: "Meet the director and cast after the screening.",
    actionLabel: "Learn More",
    actionLink: "/events/dark-knight-qa"
  },
];

export default function HomePage() {
  // ensure store is initialized and available
  const storeMovies = useSelector((state: RootState) => state.movies.list);

  return (
    <AuroraBackground>
      <AppNavbar />
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
        className="flex-1 container mx-auto px-4"
      >
        {/* components now read from the slice directly and limit to 4 items each */}
        <HeroSlider />
        <NowShowingSection />
        <ComingSoonSection />
        <CineCardsCarousel cards={newsCards} />
        <HotTrailerSection />
        <GiftPromotionsSection />
      </motion.main>
      <AppFooter />
    </AuroraBackground>
  );
}