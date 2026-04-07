import { motion } from "framer-motion";
import { useEffect } from "react";
import AppNavbar from "../../components/Layout/Navbar";
import AppFooter from "../../components/Layout/Footer";
import { AuroraBackground } from "../../components/Layout/AuroraBackground";
import MagicText from "../../components/UI/MagicText";
import { CineButton } from "../../components/UI/CineButton";

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  icon: string;
  color: string;
  details: string[];
}

interface GiftCard {
  id: number;
  denomination: number;
  description: string;
  benefits: string[];
  color: string;
}

const promotions: Promotion[] = [
  {
    id: 1,
    title: "Weekend Special",
    description: "Get 30% off on all weekend tickets",
    discount: "30%",
    validUntil: "2026-03-31",
    icon: "🎬",
    color: "from-blue-600 to-blue-900",
    details: [
      "Valid on all weekend screenings",
      "Can't be combined with other offers",
      "Minimum purchase of 2 tickets",
      "Applicable on 2D and 3D formats",
    ],
  },
  {
    id: 2,
    title: "Student Discount",
    description: "20% off with valid student ID",
    discount: "20%",
    validUntil: "2026-04-30",
    icon: "🎓",
    color: "from-purple-600 to-purple-900",
    details: [
      "Valid student ID required",
      "Available on all days",
      "For single ticket purchases",
      "Not applicable on premium formats",
    ],
  },
  {
    id: 3,
    title: "Family Bundle",
    description: "Buy 4 tickets, get 1 free",
    discount: "1 FREE",
    validUntil: "2026-02-28",
    icon: "👨‍👩‍👧‍👦",
    color: "from-pink-600 to-pink-900",
    details: [
      "Perfect for family outings",
      "All family members must attend",
      "Same show only",
      "Applicable on matinee shows",
    ],
  },
  {
    id: 4,
    title: "Senior Citizens",
    description: "25% discount for seniors (60+)",
    discount: "25%",
    validUntil: "2026-05-31",
    icon: "👴",
    color: "from-green-600 to-green-900",
    details: [
      "Proof of age required",
      "Available on all shows",
      "Single or group bookings",
      "Can't be combined with other offers",
    ],
  },
  {
    id: 5,
    title: "Midnight Madness",
    description: "50% off on late-night screenings (12 AM+)",
    discount: "50%",
    validUntil: "2026-03-15",
    icon: "🌙",
    color: "from-indigo-600 to-indigo-900",
    details: [
      "Only for screenings after midnight",
      "Limited seating available",
      "First-come, first-served",
      "Online booking only",
    ],
  },
  {
    id: 6,
    title: "Birthday Special",
    description: "Free ticket on your birthday + 20% off snacks",
    discount: "FREE",
    validUntil: "2026-12-31",
    icon: "🎂",
    color: "from-red-600 to-red-900",
    details: [
      "Valid on birthday day only",
      "Photo ID required",
      "One free ticket per person",
      "Snack discount valid for party",
    ],
  },
];

const giftCards: GiftCard[] = [
  {
    id: 1,
    denomination: 50,
    description: "Perfect for movie enthusiasts",
    benefits: [
      "Use for tickets and snacks",
      "No expiration date",
      "Perfect gift for any occasion",
      "Digital or physical available",
    ],
    color: "from-orange-400 to-red-600",
  },
  {
    id: 2,
    denomination: 100,
    description: "Great for frequent moviegoers",
    benefits: [
      "Premium value",
      "Shareable among friends",
      "Bonus 10% extra value",
      "Priority customer support",
    ],
    color: "from-yellow-400 to-orange-600",
  },
  {
    id: 3,
    denomination: 250,
    description: "Ultimate entertainment package",
    benefits: [
      "Unlimited cinema visits",
      "Bonus 15% extra value",
      "VIP lounge access",
      "Exclusive merchandise",
    ],
    color: "from-purple-400 to-pink-600",
  },
];

const loyaltyTiers = [
  {
    tier: "Silver",
    points: "0 - 500",
    benefits: ["5% discount on all tickets", "Free popcorn monthly", "Birthday bonus"],
    color: "from-gray-300 to-gray-500",
  },
  {
    tier: "Gold",
    points: "501 - 2000",
    benefits: ["10% discount on all tickets", "Free large popcorn + drink", "Priority booking", "Birthday bonus + 20% off snacks"],
    color: "from-yellow-300 to-yellow-500",
  },
  {
    tier: "Platinum",
    points: "2001+",
    benefits: ["20% discount on all tickets", "Free VIP snack box", "VIP lounge access", "Exclusive premiere invitations", "Birthday free ticket + snacks"],
    color: "from-blue-300 to-blue-500",
  },
];

export default function PromotionsPage() {
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
            gradientColors={["#ff6b35", "#f7931e", "#fdb833", "#f1e5ac"]}
            starColors={["#ff6b35", "#f7931e", "#fdb833", "#f1e5ac"]}
            starCount={4}
            gradientSpeed="2.5s"
            sparkleFrequency={1200}
            starSize="clamp(18px,2vw,32px)"
            className="text-4xl sm:text-5xl md:text-6xl font-title font-extrabold leading-tight mb-4"
          >
            Promotions & Offers
          </MagicText>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Discover amazing discounts and exclusive offers at WyvernBox Cinema
          </p>
        </div>

        {/* Active Promotions */}
        <section className="mb-16">
          <h2 className="text-3xl font-title font-bold mb-8 text-white flex items-center gap-2">
            <span className="text-4xl">🎉</span> Current Promotions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className={`bg-gradient-to-br ${promo.color} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/10`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-title font-bold text-white mb-2">
                      {promo.title}
                    </h3>
                    <p className="text-white/80 text-sm">{promo.description}</p>
                  </div>
                  <span className="text-5xl">{promo.icon}</span>
                </div>

                <div className="bg-white/20 rounded-lg p-4 mb-4 backdrop-blur">
                  <div className="text-white/70 text-sm mb-1">Discount</div>
                  <div className="text-5xl font-bold text-white">{promo.discount}</div>
                  <div className="text-white/60 text-xs mt-1">Valid until {promo.validUntil}</div>
                </div>

                <div className="space-y-2 mb-6">
                  {promo.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-white/80 text-sm">
                      <span className="text-lg mt-0.5">✓</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <CineButton className="w-full">
                  Claim Offer
                </CineButton>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gift Cards */}
        <section className="mb-16">
          <h2 className="text-3xl font-title font-bold mb-8 text-white flex items-center gap-2">
            <span className="text-4xl">🎁</span> Gift Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {giftCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className={`bg-gradient-to-br ${card.color} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-white`}
              >
                <div className="mb-6">
                  <div className="text-sm font-title font-bold opacity-80 mb-2">Gift Card</div>
                  <div className="text-6xl font-title font-bold mb-2">${card.denomination}</div>
                  <p className="opacity-80">{card.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {card.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-xl mt-0.5">★</span>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <CineButton className="w-full bg-white text-black hover:bg-gray-100">
                  Buy Now
                </CineButton>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Loyalty Program */}
        <section className="mb-16">
          <h2 className="text-3xl font-title font-bold mb-8 text-white flex items-center gap-2">
            <span className="text-4xl">⭐</span> Loyalty Program
          </h2>
          <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-2xl p-8 mb-8">
            <p className="text-gray-300 text-lg mb-8">
              Join our loyalty program and earn points with every purchase! Redeem your points for free tickets, snacks, and exclusive perks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loyaltyTiers.map((tierInfo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className={`bg-gradient-to-br ${tierInfo.color} rounded-xl p-6 text-white`}
                >
                  <h3 className="text-2xl font-title font-bold mb-2">{tierInfo.tier}</h3>
                  <div className="text-sm opacity-80 mb-6">Points: {tierInfo.points}</div>

                  <ul className="space-y-2">
                    {tierInfo.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-lg mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
          <CineButton className="w-full py-4 text-lg">
            Join Loyalty Program
          </CineButton>
        </section>

        {/* How to Use Promotions */}
        <section className="mb-16">
          <h2 className="text-3xl font-title font-bold mb-8 text-white">How to Use Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Browse Offers", description: "Check our current promotions and find the best deal for you" },
              { step: 2, title: "Select Offer", description: "Click on the promotion you want to claim or apply" },
              { step: 3, title: "Book Tickets", description: "Purchase your tickets with the promotional code applied" },
              { step: 4, title: "Enjoy!", description: "Visit your cinema and enjoy your movie experience" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white font-bold text-lg mb-4 flex-shrink-0">
                  {item.step}
                </div>
                <h3 className="text-xl font-title font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Terms & Conditions */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-title font-bold text-white mb-4">Terms & Conditions</h2>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>All promotions are valid for the dates mentioned and subject to availability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Offers cannot be combined with other promotional codes unless explicitly stated</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>WyvernBox Cinema reserves the right to modify or discontinue offers at any time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Loyalty points are non-transferable and cannot be converted to cash</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>For more information, contact our customer service team</span>
              </li>
            </ul>
          </motion.div>
        </section>
      </motion.main>
      <AppFooter />
    </AuroraBackground>
  );
}
