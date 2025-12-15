import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { useBookings } from '../../hooks';
import { usePublicMovies } from '../../hooks';
import type { MovieResponseDTO } from '../../types/auth';
import { motion } from 'framer-motion';
import Stepper, { Step } from '../../components/UI/Stepper';
import { AuroraBackground } from '../../components/Layout/AuroraBackground';
import AppNavbar from '../../components/Layout/Navbar';
import AppFooter from '../../components/Layout/Footer';
import NotFoundPage from '../shared/NotFoundPage';
import { PaymentStatusModal, type PaymentStatus } from './components/PaymentStatusModal';

interface BookingData {
  movieId: string;
  seats: string[];
  showTime?: string;
  showDate?: string;
  customerName: string;
  email: string;
  phone: string;
  paymentMethod: 'card' | 'paypal' | 'upi';
  cardDetails?: {
    holderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
}

// Validation functions for each step
const validateStep1 = (showTime?: string, showDate?: string): boolean => {
  return !!(showTime && showDate);
};

const validateStep2 = (seats: string[]): boolean => {
  return seats.length > 0;
};

const validateStep3 = (customerName: string, email: string, phone: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return !!(customerName.trim() && email.trim() && emailRegex.test(email) && phone.trim() && phoneRegex.test(phone));
};

const validateStep4 = (paymentMethod: string): boolean => {
  return !!paymentMethod;
};

export default function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchMovieById } = usePublicMovies();
  const { addBooking } = useBookings();
  
  const [movie, setMovie] = useState<MovieResponseDTO | null>(
    (location.state?.movie as MovieResponseDTO) || null
  );
  const [isLoading, setIsLoading] = useState(!(location.state?.movie));
  const initialSeats: string[] = location.state?.seats?.map((s: number | string) => s.toString()) || [];

  // Fetch movie on mount only if not already provided through state
  useEffect(() => {
    if (!movie && id) {
      setIsLoading(true);
      const fetchMovie = async () => {
        const movieData = await fetchMovieById(parseInt(id));
        setMovie(movieData);
        setIsLoading(false);
      };
      fetchMovie();
    }
  }, [id, fetchMovieById, movie]);

  const [bookingData, setBookingData] = useState<BookingData>({
    movieId: id || '',
    seats: initialSeats,
    showTime: '7:00 PM',
    showDate: new Date().toISOString().split('T')[0],
    customerName: '',
    email: '',
    phone: '',
    paymentMethod: 'card',
  });

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  // Define premium seats (e.g., middle rows, center columns)
  const premiumSeats = ['C4', 'C5', 'D4', 'D5'];

  // Compute step validations
  const isStep1Valid = validateStep1(bookingData.showTime, bookingData.showDate);
  const isStep2Valid = validateStep2(bookingData.seats);
  const isStep3Valid = validateStep3(bookingData.customerName, bookingData.email, bookingData.phone);
  const isStep4Valid = validateStep4(bookingData.paymentMethod);

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleFinalStepCompleted = async () => {
    setLoading(true);
    const amount = bookingData.seats.reduce((total, seat) => total + (premiumSeats.includes(seat) ? 300 : 250), 0);
    const txId = 'TXN-' + Math.random().toString(36).substring(7).toUpperCase();
    
    setTransactionId(txId);
    setTotalAmount(amount);
    
    // Show processing status
    setPaymentStatus('processing');
    setShowPaymentModal(true);

    try {
      // Simulate payment processing (1-2 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly determine payment success (90% success rate for demo)
      const isSuccess = Math.random() < 0.9;
      
      if (isSuccess) {
        setPaymentStatus('successful');
        // Auto-navigate after 3 seconds via the modal's onNavigateToTransactions callback
      } else {
        setPaymentStatus('unsuccessful');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentRetry = useCallback(() => {
    setShowPaymentModal(false);
    setPaymentStatus(null);
    setLoading(false);
    setCurrentStep(4);
  }, []);

  const handleNavigateToHome = useCallback(() => {
    addBooking({
      movieId: bookingData.movieId,
      seats: bookingData.seats.map(s => parseInt(s.replace(/\D/g, ''), 10)).filter(n => !isNaN(n)),
      name: bookingData.customerName
    });
    navigate('/');
  }, [bookingData.movieId, bookingData.seats, bookingData.customerName, addBooking, navigate]);

  if (isLoading) {
    return (
      <AuroraBackground>
        <AppNavbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center min-h-screen"
        >
          <div className="text-white">Loading booking details...</div>
        </motion.main>
        <AppFooter />
      </AuroraBackground>
    );
  }

  if (!movie) {
    return <NotFoundPage title="Movie Not Found" description="The movie you're looking for doesn't exist or has been removed." backButtonPath="/movies" />;
  }

  return (
    <AuroraBackground>
      <AppNavbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 container mx-auto px-4 py-12"
      >
        <Stepper
          onFinalStepCompleted={handleFinalStepCompleted}
          onStepChange={handleStepChange}
          stepCircleContainerClassName="booking-stepper"
          disableStepIndicators={false}
          disableStepIndicatorNavigation={true}
          nextButtonProps={{
            disabled: 
              (currentStep === 1 && !isStep1Valid) ||
              (currentStep === 2 && !isStep2Valid) ||
              (currentStep === 3 && !isStep3Valid) ||
              (currentStep === 4 && !isStep4Valid),
            style: {
              opacity: 
                (currentStep === 1 && !isStep1Valid) ||
                (currentStep === 2 && !isStep2Valid) ||
                (currentStep === 3 && !isStep3Valid) ||
                (currentStep === 4 && !isStep4Valid) ? 0.5 : 1,
              cursor:
                (currentStep === 1 && !isStep1Valid) ||
                (currentStep === 2 && !isStep2Valid) ||
                (currentStep === 3 && !isStep3Valid) ||
                (currentStep === 4 && !isStep4Valid) ? 'not-allowed' : 'pointer',
            }
          }}
        >
          {/* Step 1: Show Time Selection */}
          <Step>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-title font-bold text-white mb-2">Show Time Selection</h2>
                <p className="text-slate-100 font-semibold drop-shadow-md">Choose your preferred show time and date</p>
              </div>

              {/* Movie Info Card */}
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10 rounded-xl p-6">
                <div className="flex gap-6">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-24 h-32 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-title font-bold text-white mb-2">{movie.title}</h3>
                    <p className="text-slate-100 mb-4 drop-shadow-md">{movie.description?.substring(0, 150)}...</p>
                    <div className="flex gap-4">
                      {movie.genres?.slice(0, 3).map(genre => (
                        <span key={genre.id} className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-200 text-sm rounded-full font-label">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-white font-label font-semibold">Select Date</label>
                  {!bookingData.showDate && (
                    <span className="text-red-400 text-sm font-medium font-body">Required</span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map(day => {
                    const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = bookingData.showDate === dateStr;
                    return (
                      <button
                        key={day}
                        onClick={() => handleInputChange('showDate', dateStr)}
                        className={`cursor-target p-3 rounded-lg font-semibold transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                            : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                        }`}
                      >
                        <div className="text-sm font-body">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-lg font-body">{date.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-white font-label font-semibold">Select Time</label>
                  {!bookingData.showTime && (
                    <span className="text-red-400 text-sm font-medium font-body">Required</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '7:00 PM', '10:00 PM'].map(time => (
                    <button
                      key={time}
                      onClick={() => handleInputChange('showTime', time)}
                      className={`cursor-target p-3 rounded-lg font-semibold transition-all ${
                        bookingData.showTime === time
                          ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                          : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {!isStep1Valid && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-950/40 border-2 border-red-500 rounded-lg p-4 text-red-100 text-sm font-semibold shadow-lg drop-shadow-md"
                >
                  ⚠ Please select both a date and a time to continue.
                </motion.div>
              )}
            </motion.div>
          </Step>

          {/* Step 2: Seat Selection & Summary */}
          <Step>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-title font-bold text-white mb-2">Seat Selection</h2>
                    <p className="text-slate-400">Your selected seats: <span className="text-cyan-400 font-semibold">{bookingData.seats.join(', ') || 'None selected'}</span></p>
                  </div>
                  {!isStep2Valid && (
                    <span className="text-red-400 text-sm font-medium bg-red-500/20 border border-red-500/50 px-3 py-1 rounded-lg font-body">
                      Select at least 1 seat
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Seat Chart - Left Column */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10 rounded-xl p-8">
                    <div className="text-center mb-6">
                      <p className="text-slate-300 text-lg font-semibold font-label">Screen</p>
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-4 rounded-full"></div>
                    </div>

                    {/* Simulated Seat Grid */}
                    <div className="space-y-3 max-w-2xl mx-auto">
                      {['A', 'B', 'C', 'D', 'E'].map(row => (
                        <div key={row} className="flex justify-center gap-2">
                          <span className="w-8 flex items-center justify-center text-white text-sm font-bold drop-shadow-md font-body">{row}</span>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(col => {
                              const seatNum = `${row}${col}`;
                              const isSelected = bookingData.seats.includes(seatNum);
                              const isPremium = premiumSeats.includes(seatNum);
                              return (
                                <button
                                  key={seatNum}
                                  onClick={() => {
                                    setBookingData(prev => ({
                                      ...prev,
                                      seats: isSelected
                                        ? prev.seats.filter(s => s !== seatNum)
                                        : [...prev.seats, seatNum]
                                    }));
                                  }}
                                  className={`cursor-target w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg scale-110'
                                      : isPremium
                                      ? 'bg-yellow-600/60 text-yellow-200 hover:bg-yellow-600 border border-yellow-500/50'
                                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  }`}
                                  title={isPremium ? 'Premium Seat' : 'Standard Seat'}
                                >
                                  {isSelected ? '✓' : ''}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center gap-6 mt-8 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-slate-700 rounded"></div>
                        <span className="text-slate-100 text-sm font-semibold drop-shadow-md font-label">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-600/60 rounded border border-yellow-500/50"></div>
                        <span className="text-slate-100 text-sm font-semibold drop-shadow-md font-label">Premium (₹300)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded"></div>
                        <span className="text-slate-100 text-sm font-semibold drop-shadow-md font-label">Selected</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Summary - Right Column */}
                <div className="space-y-4">
                  <div className="bg-slate-800/60 border border-white/20 rounded-lg p-4">
                    <p className="text-slate-100 text-xs font-semibold drop-shadow-md uppercase tracking-wide font-label">Show Time</p>
                    <p className="text-white font-bold text-lg mt-1 font-body">{bookingData.showTime}</p>
                  </div>
                  <div className="bg-slate-800/60 border border-white/20 rounded-lg p-4">
                    <p className="text-slate-100 text-xs font-semibold drop-shadow-md uppercase tracking-wide font-label">Selected Seats</p>
                    <p className="text-white font-bold text-lg mt-1 font-body">{bookingData.seats.length} Seat{bookingData.seats.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="bg-slate-800/60 border border-white/20 rounded-lg p-4">
                    <p className="text-slate-100 text-xs font-semibold drop-shadow-md uppercase tracking-wide font-label">Standard Seats</p>
                    <p className="text-white font-bold text-lg mt-1 font-body">{bookingData.seats.filter(s => !premiumSeats.includes(s)).length} × ₹250</p>
                  </div>
                  <div className="bg-slate-800/60 border border-white/20 rounded-lg p-4">
                    <p className="text-slate-100 text-xs font-semibold drop-shadow-md uppercase tracking-wide font-label">Premium Seats</p>
                    <p className="text-yellow-300 font-bold text-lg mt-1 font-body">{bookingData.seats.filter(s => premiumSeats.includes(s)).length} × ₹300</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-lg p-4 sticky top-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-slate-100 font-semibold drop-shadow-md">Total Price</span>
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 font-bold text-3xl drop-shadow-lg">
                        ₹{bookingData.seats.reduce((total, seat) => total + (premiumSeats.includes(seat) ? 300 : 250), 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!isStep2Valid && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-950/40 border-2 border-red-500 rounded-lg p-4 text-red-100 text-sm font-semibold shadow-lg drop-shadow-md"
                >
                  ⚠ Please select at least one seat to continue.
                </motion.div>
              )}
            </motion.div>
          </Step>

          {/* Step 3: Customer Details */}
          <Step>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-title font-bold text-white mb-2">Passenger Details</h2>
                <p className="text-slate-100 font-semibold drop-shadow-md">Enter your information</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-label font-semibold mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={bookingData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all ${
                      bookingData.customerName.trim() 
                        ? 'border-white/10 focus:border-purple-500' 
                        : 'border-white/10 focus:border-red-500'
                    }`}
                  />
                  {!bookingData.customerName.trim() && (
                    <p className="text-red-300 text-sm mt-2 font-semibold drop-shadow-md font-body">Name is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-label font-semibold mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all ${
                      bookingData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)
                        ? 'border-white/10 focus:border-purple-500' 
                        : 'border-white/10 focus:border-red-500'
                    }`}
                  />
                  {bookingData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email) && (
                    <p className="text-red-300 text-sm mt-2 font-semibold drop-shadow-md font-body">Please enter a valid email</p>
                  )}
                  {!bookingData.email.trim() && (
                    <p className="text-red-300 text-sm mt-2 font-semibold drop-shadow-md font-body">Email is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-label font-semibold mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all ${
                      bookingData.phone.trim() && /^[0-9+\-\s()]+$/.test(bookingData.phone)
                        ? 'border-white/10 focus:border-purple-500' 
                        : 'border-white/10 focus:border-red-500'
                    }`}
                  />
                  {bookingData.phone.trim() && !/^[0-9+\-\s()]+$/.test(bookingData.phone) && (
                    <p className="text-red-300 text-sm mt-2 font-semibold drop-shadow-md font-body">Please enter a valid phone number</p>
                  )}
                  {!bookingData.phone.trim() && (
                    <p className="text-red-300 text-sm mt-2 font-semibold drop-shadow-md font-body">Phone number is required</p>
                  )}
                </div>
              </div>

              {!isStep3Valid && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-950/40 border-2 border-red-500 rounded-lg p-4 text-red-100 text-sm font-semibold shadow-lg drop-shadow-md"
                >
                  ⚠ Please fill in all required fields with valid information.
                </motion.div>
              )}
            </motion.div>
          </Step>

          {/* Step 4: Payment */}
          <Step>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-title font-bold text-white mb-2">Payment</h2>
                <p className="text-slate-100 font-semibold drop-shadow-md">Complete your booking with secure payment</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Methods & Card Details - Left Column */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <label className="cursor-target flex items-center p-4 bg-slate-800/50 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-all"
                      style={{borderColor: bookingData.paymentMethod === 'card' ? '#1e3a8a' : 'transparent'}}>
                      <input
                        type="radio"
                        name="payment"
                        checked={bookingData.paymentMethod === 'card'}
                        onChange={() => handleInputChange('paymentMethod', 'card')}
                        className="mr-4 w-5 h-5"
                      />
                      <img src="/visa.png" alt="Visa" className="h-8" />
                      <span className="text-white font-semibold ml-4">Credit/Debit Card (Visa, Mastercard)</span>
                    </label>

                    <label className="cursor-target flex items-center p-4 bg-slate-800/50 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-all"
                      style={{borderColor: bookingData.paymentMethod === 'paypal' ? '#1e3a8a' : 'transparent'}}>
                      <input
                        type="radio"
                        name="payment"
                        checked={bookingData.paymentMethod === 'paypal'}
                        onChange={() => handleInputChange('paymentMethod', 'paypal')}
                        className="mr-4 w-5 h-5"
                      />
                      <img src="/paypal.png" alt="PayPal" className="h-8" />
                      <span className="text-white font-semibold ml-4">PayPal</span>
                    </label>

                    <label className="cursor-target flex items-center p-4 bg-slate-800/50 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-all"
                      style={{borderColor: bookingData.paymentMethod === 'upi' ? '#1e3a8a' : 'transparent'}}>
                      <input
                        type="radio"
                        name="payment"
                        checked={bookingData.paymentMethod === 'upi'}
                        onChange={() => handleInputChange('paymentMethod', 'upi')}
                        className="mr-4 w-5 h-5"
                      />
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded font-bold text-white text-xs mr-4">₹</div>
                      <span className="text-white font-semibold">UPI Payment</span>
                    </label>
                  </div>

                  {/* Card Details Form */}
                  {bookingData.paymentMethod === 'card' && (
                    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10 rounded-xl p-6 space-y-4">
                      <div>
                        <label className="block text-white font-label font-semibold mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="Name on card"
                          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-label font-semibold mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="XXXX XXXX XXXX XXXX"
                          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-label font-semibold mb-2">Expiry Month</label>
                          <input
                            type="text"
                            placeholder="MM"
                            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-label font-semibold mb-2">CVV</label>
                          <input
                            type="text"
                            placeholder="XXX"
                            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary - Right Column */}
                <div>
                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl p-6 sticky top-4">
                    <h3 className="text-white font-title font-bold mb-4 text-lg drop-shadow-md">Order Summary</h3>
                    <div className="space-y-3">
                      {bookingData.seats.filter(s => !premiumSeats.includes(s)).length > 0 && (
                        <div className="flex justify-between text-white font-semibold drop-shadow-md">
                          <span className="text-slate-100">{bookingData.seats.filter(s => !premiumSeats.includes(s)).length} Standard Seats × ₹250</span>
                          <span className="text-white">₹{bookingData.seats.filter(s => !premiumSeats.includes(s)).length * 250}</span>
                        </div>
                      )}
                      {bookingData.seats.filter(s => premiumSeats.includes(s)).length > 0 && (
                        <div className="flex justify-between text-yellow-100 font-semibold drop-shadow-md">
                          <span className="text-yellow-200">{bookingData.seats.filter(s => premiumSeats.includes(s)).length} Premium Seats × ₹300</span>
                          <span className="text-yellow-100">₹{bookingData.seats.filter(s => premiumSeats.includes(s)).length * 300}</span>
                        </div>
                      )}
                      <div className="border-t border-white/20 pt-3 flex justify-between">
                        <span className="text-white font-bold drop-shadow-md">Total Amount</span>
                        <span className="text-white font-bold text-xl drop-shadow-lg">
                          ₹{bookingData.seats.reduce((total, seat) => total + (premiumSeats.includes(seat) ? 300 : 250), 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!isStep4Valid && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-950/40 border-2 border-red-500 rounded-lg p-4 text-red-100 text-sm font-semibold shadow-lg drop-shadow-md"
                >
                  ⚠ Please select a payment method to continue.
                </motion.div>
              )}

              {loading && (
                <div className="flex items-center justify-center gap-2 text-cyan-400">
                  <div className="animate-spin">⚡</div>
                  <span>Processing your booking...</span>
                </div>
              )}
            </motion.div>
          </Step>
        </Stepper>
      </motion.main>
      <AppFooter />

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={showPaymentModal}
        status={paymentStatus || 'processing'}
        transactionId={transactionId}
        amount={totalAmount}
        onClose={handlePaymentRetry}
        onNavigateToHome={handleNavigateToHome}
      />
    </AuroraBackground>
  );
}