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
    actionLink: "/movie/inception"
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

const movies = [
  {
    id: "1",
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    releaseDate: "2010-07-16",
  },
  {
    id: "2",
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseDate: "2014-11-07",
  },
  {
    id: "3",
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy and forces Batman closer to crossing the line between hero and vigilante.",
    releaseDate: "2008-07-18",
  },
  {
    id: "4",
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    releaseDate: "2024-03-01",
  },
];

export default function HomePage() {
  const moviesFromStore = useSelector((state: RootState) => state.movies.list);

  return (
    <AuroraBackground>
      <AppNavbar />
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
        className="flex-1 container mx-auto px-4"
      >
        <HeroSlider movies={moviesFromStore} />
        <NowShowingSection movies={movies.map(movie => ({
          ...movie,
          releaseDate: movie.releaseDate ?? '',
        }))} />
        <ComingSoonSection />
        <CineCardsCarousel cards={newsCards} />
        <HotTrailerSection />
        <GiftPromotionsSection />
      </motion.main>
      <AppFooter />
    </AuroraBackground>
  );
}