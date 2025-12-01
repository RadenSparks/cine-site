import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  TicketIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { type RootState } from "../../store";
import { motion } from "framer-motion";
import { AccountSidebar } from "../../components/Layout/AccountSidebar";
import { BackButton } from "../../components/UI/BackButton";
import TargetCursor from "../../components/Layout/TargetCursor";

interface Booking {
  id: string;
  movieTitle: string;
  date: string;
  time: string;
  cinema: string;
  seats: string[];
  status: "confirmed" | "pending" | "cancelled";
  price: number;
  bookingDate: string;
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [bookings] = useState<Booking[]>(() => {
    if (!user) {
      navigate("/auth");
      return [];
    }
    return [
      {
        id: "BK001",
        movieTitle: "The Dark Knight",
        date: "2025-01-15",
        time: "19:30",
        cinema: "Screen 1 - CinePlex Downtown",
        seats: ["A5", "A6"],
        status: "confirmed",
        price: 25.99,
        bookingDate: "2025-01-10",
      },
      {
        id: "BK002",
        movieTitle: "Inception",
        date: "2025-01-18",
        time: "14:00",
        cinema: "Screen 3 - CinePlex Mall",
        seats: ["B2", "B3", "B4"],
        status: "confirmed",
        price: 38.97,
        bookingDate: "2025-01-08",
      },
      {
        id: "BK003",
        movieTitle: "Avatar",
        date: "2024-12-25",
        time: "20:00",
        cinema: "Screen 2 - CinePlex Downtown",
        seats: ["C1"],
        status: "cancelled",
        price: 13.99,
        bookingDate: "2024-12-20",
      },
    ];
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const statusConfig = {
    confirmed: {
      bg: "bg-green-500/20",
      border: "border-green-400/50",
      text: "text-green-300",
      label: "Confirmed",
      icon: CheckCircleIcon,
    },
    pending: {
      bg: "bg-yellow-500/20",
      border: "border-yellow-400/50",
      text: "text-yellow-300",
      label: "Pending",
      icon: ClockIcon,
    },
    cancelled: {
      bg: "bg-red-500/20",
      border: "border-red-400/50",
      text: "text-red-300",
      label: "Cancelled",
      icon: TicketIcon,
    },
  };

  if (bookings.length === 0 && !user) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-pink-900 px-4 sm:px-6 lg:px-8 pt-16 pb-8"
    >
      <TargetCursor targetSelector="button, a[role='button'], [role='button'], .btn, .button, [class*='btn'], [class*='button'], .shiny-cta, .shiny-cta-link, .cursor-target" spinDuration={2} hideDefaultCursor={true} hoverDuration={0.2} parallaxOn={true} />
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative w-full mx-auto">
        {/* Back Button */}
        <div className="mb-6 px-6">
          <BackButton />
        </div>

        <div className="flex flex-col lg:flex-row gap-0 h-fit px-6">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Main Content */}
          <div className="flex-1 min-h-0 ml-6">
            <motion.div
              className="backdrop-blur-sm bg-white/10 shadow-2xl rounded-2xl border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-8">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center gap-3">
                  <TicketIcon className="w-8 h-8 text-white" />
                  <h1 className="text-3xl font-bold text-white">My Bookings</h1>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <TicketIcon className="w-16 h-16 text-indigo-300 mx-auto mb-4 opacity-50" />
                    <p className="text-indigo-100 text-lg">
                      No bookings found. Start booking your favorite movies!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {bookings.map((booking, index) => {
                    const statusInfo =
                      statusConfig[booking.status as keyof typeof statusConfig];
                    const StatusIcon = statusInfo.icon;

                    return (
                      <motion.div
                        key={booking.id}
                        className={`${statusInfo.bg} ${statusInfo.border} border rounded-xl p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-200`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          {/* Movie Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-4">
                              <h3 className="text-xl font-bold text-white">
                                {booking.movieTitle}
                              </h3>
                              <div
                                className={`${statusInfo.bg} ${statusInfo.border} border rounded-full px-3 py-1 flex items-center gap-1 flex-shrink-0`}
                              >
                                <StatusIcon
                                  className={`w-4 h-4 ${statusInfo.text}`}
                                />
                                <span
                                  className={`text-xs font-semibold ${statusInfo.text}`}
                                >
                                  {statusInfo.label}
                                </span>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-indigo-100">
                                <CalendarIcon className="w-4 h-4 flex-shrink-0 text-pink-400" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-indigo-100">
                                <ClockIcon className="w-4 h-4 flex-shrink-0 text-pink-400" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-indigo-100">
                                <MapPinIcon className="w-4 h-4 flex-shrink-0 text-pink-400" />
                                <span>{booking.cinema}</span>
                              </div>
                              <div className="text-indigo-100">
                                <span className="font-semibold">Seats:</span>{" "}
                                {booking.seats.join(", ")}
                              </div>
                            </div>
                          </div>

                          {/* Price & Booking ID */}
                          <div className="flex flex-col items-end gap-4 border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-4">
                            <div className="text-right">
                              <p className="text-indigo-100 text-xs mb-1">
                                Total Price
                              </p>
                              <p className="text-2xl font-bold text-pink-300">
                                ${booking.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-indigo-100 text-xs mb-1">
                                Booking ID
                              </p>
                              <p className="text-sm font-mono text-white">
                                {booking.id}
                              </p>
                            </div>
                            <p className="text-xs text-indigo-200">
                              Booked on {booking.bookingDate}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                    })}
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
