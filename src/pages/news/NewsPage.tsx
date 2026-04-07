import { motion } from "framer-motion";
import { useEffect } from "react";
import AppNavbar from "../../components/Layout/Navbar";
import AppFooter from "../../components/Layout/Footer";
import { AuroraBackground } from "../../components/Layout/AuroraBackground";
import MagicText from "../../components/UI/MagicText";
import { CineButton } from "../../components/UI/CineButton";

interface NewsItem {
  id: number;
  category: string;
  title: string;
  src: string;
  description: string;
  content: string;
  actionLabel: string;
  actionLink: string;
  date: string;
  author: string;
}

const newsArticles: NewsItem[] = [
  {
    id: 1,
    category: "Premiere",
    title: "Premiere Night: Inception",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    description: "Join us for the exclusive premiere of Inception!",
    content: "Experience the mind-bending thriller Inception in a spectacular premiere event. Meet the cast, enjoy premium catering, and be part of an unforgettable evening celebrating cinema.",
    actionLabel: "Book Tickets",
    actionLink: "/movie/9",
    date: "2026-02-15",
    author: "Cinema Team",
  },
  {
    id: 2,
    category: "Festival",
    title: "Kids Animation Festival",
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    description: "A weekend of fun for the whole family.",
    content: "Join us for an exciting weekend of animated films perfect for kids and families. Special screenings, interactive sessions, and exclusive merchandise await!",
    actionLabel: "See Details",
    actionLink: "/events/animation-festival",
    date: "2026-03-01",
    author: "Events Team",
  },
  {
    id: 3,
    category: "Q&A",
    title: "Director Q&A: The Dark Knight",
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    description: "Meet the director and cast after the screening.",
    content: "Join us for an exclusive Q&A session with the acclaimed director of The Dark Knight trilogy. Learn behind-the-scenes stories and insights into the filmmaking process.",
    actionLabel: "Learn More",
    actionLink: "/events/dark-knight-qa",
    date: "2026-02-28",
    author: "Special Events",
  },
  {
    id: 4,
    category: "Award",
    title: "Festival Award: Best Picture",
    src: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80",
    description: "Celebrating outstanding cinematography and storytelling.",
    content: "Our theater celebrates the award-winning film that took home Best Picture at the International Film Festival. Now showing in stunning 4K digital format.",
    actionLabel: "Watch Now",
    actionLink: "/movies?award=best-picture",
    date: "2026-02-20",
    author: "Cinema Team",
  },
  {
    id: 5,
    category: "Behind The Scenes",
    title: "Exclusive: Movie Production Insights",
    src: "https://images.unsplash.com/photo-1485579149c0-123123de6322?auto=format&fit=crop&w=600&q=80",
    description: "Discover the magic behind your favorite films.",
    content: "Get exclusive behind-the-scenes access to how your favorite movies were made. From concept art to final editing, explore the creative journey.",
    actionLabel: "Explore",
    actionLink: "/news/behind-the-scenes",
    date: "2026-02-10",
    author: "Production Team",
  },
  {
    id: 6,
    category: "Event",
    title: "Valentine's Day Special Screenings",
    src: "https://images.unsplash.com/photo-1489599849228-ed02db880814?auto=format&fit=crop&w=600&q=80",
    description: "Romance is in the air at our theater.",
    content: "Celebrate Valentine's Day with our specially curated selection of romantic films. Enjoy couple packages with complimentary champagne and chocolates.",
    actionLabel: "Book Now",
    actionLink: "/booking",
    date: "2026-02-01",
    author: "Marketing Team",
  },
];

export default function NewsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuroraBackground>
      <AppNavbar />
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
        className="flex-1 container mx-auto px-4 py-12 pt-32"
      >
        {/* Header */}
        <div className="mb-16 text-center">
          <MagicText
            gradientColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]}
            starColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]}
            starCount={4}
            gradientSpeed="2.5s"
            sparkleFrequency={1200}
            starSize="clamp(18px,2vw,32px)"
            className="text-4xl sm:text-5xl md:text-6xl font-title font-extrabold leading-tight mb-4"
          >
            Cinema News & Events
          </MagicText>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Stay updated with the latest news, exclusive events, and behind-the-scenes content from our cinema
          </p>
        </div>

        {/* Featured News */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-title font-bold mb-8 text-white">Featured News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsArticles.slice(0, 2).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative h-80 md:h-96 overflow-hidden">
                  <img
                    src={article.src}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                    <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-3 w-fit">
                      {article.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-title font-bold text-white mb-2">
                      {article.title}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-300 text-sm mb-2">
                    <span className="text-orange-400 font-bold">{article.date}</span> • {article.author}
                  </p>
                  <p className="text-gray-400 mb-4 line-clamp-2">{article.content}</p>
                  <div className="flex gap-3">
                    <CineButton className="flex-1">
                      {article.actionLabel}
                    </CineButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* All News Grid */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-title font-bold mb-8 text-white">Latest Updates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="group bg-gray-900/50 backdrop-blur border border-gray-700 rounded-xl overflow-hidden hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.src}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-block bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 text-xs mb-2">{article.date}</p>
                  <h3 className="text-lg font-title font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{article.description}</p>
                  <CineButton className="w-full text-sm">
                    Read More
                  </CineButton>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/30 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-title font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss exclusive movie premieres, special events, and promotional offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <CineButton>
                Subscribe
              </CineButton>
            </div>
          </motion.div>
        </section>
      </motion.main>
      <AppFooter />
    </AuroraBackground>
  );
}
