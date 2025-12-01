import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from 'react';

export type PaymentStatus = 'successful' | 'processing' | 'unsuccessful';

interface PaymentStatusModalProps {
  isOpen: boolean;
  status: PaymentStatus;
  transactionId?: string;
  amount?: number;
  onClose?: () => void;
  onNavigateToHome?: () => void;
}

export function PaymentStatusModal({
  isOpen,
  status,
  transactionId = 'TXN-' + Math.random().toString(36).substring(7).toUpperCase(),
  amount = 0,
  onClose,
  onNavigateToHome,
}: PaymentStatusModalProps) {
  const [autoClose, setAutoClose] = useState(false);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (status === 'successful' && isOpen) {
      const timer = setTimeout(() => {
        setAutoClose(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, isOpen]);

  useEffect(() => {
    if (autoClose && onNavigateToHome && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      onNavigateToHome();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClose]);

  const statusConfig = {
    successful: {
      icon: CheckCircleIcon,
      title: 'Payment Successful',
      message: 'Your booking has been confirmed. Check your email for details.',
      bgGradient: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/50',
      accentColor: 'text-green-300',
      buttonColor: 'bg-green-600 hover:bg-green-700',
    },
    processing: {
      icon: ClockIcon,
      title: 'Processing Payment',
      message: 'Your payment is being processed. Please wait...',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/50',
      accentColor: 'text-yellow-300',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    },
    unsuccessful: {
      icon: ExclamationCircleIcon,
      title: 'Payment Failed',
      message: 'Your payment could not be processed. Please try again with another payment method.',
      bgGradient: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/50',
      accentColor: 'text-red-300',
      buttonColor: 'bg-red-600 hover:bg-red-700',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`bg-gradient-to-br ${config.bgGradient} border ${config.borderColor} rounded-2xl max-w-md w-full p-8 shadow-2xl`}
          >
            {/* Icon with animation */}
            <motion.div
              animate={status === 'processing' ? { rotate: 360 } : {}}
              transition={
                status === 'processing'
                  ? { duration: 2, repeat: Infinity, ease: 'linear' }
                  : {}
              }
              className="flex justify-center mb-6"
            >
              <Icon className={`w-16 h-16 ${config.accentColor}`} />
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-3">
              {config.title}
            </h2>

            {/* Message */}
            <p className="text-white text-center mb-6 font-medium drop-shadow-lg">
              {config.message}
            </p>

            {/* Transaction Details */}
            <div className="bg-black/50 rounded-lg p-4 mb-6 space-y-2 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-slate-100 text-sm font-semibold">Transaction ID:</span>
                <span className="text-white font-mono text-sm font-bold drop-shadow-md">{transactionId}</span>
              </div>
              {amount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-100 text-sm font-semibold">Amount:</span>
                  <span className="text-white font-bold text-lg drop-shadow-md">
                    ₹{amount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-100 text-sm font-semibold">Status:</span>
                <span className={`text-sm font-bold capitalize drop-shadow-md ${config.accentColor}`}>
                  {status}
                </span>
              </div>
            </div>

            {/* Progress bar for processing */}
            {status === 'processing' && (
              <div className="w-full bg-slate-700 rounded-full h-2 mb-6 overflow-hidden">
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 w-1/3"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              {status === 'unsuccessful' && (
                <button
                  onClick={onClose}
                  className={`cursor-target w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${config.buttonColor}`}
                >
                  Try Again
                </button>
              )}
              {status === 'successful' && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={onNavigateToHome}
                  className={`cursor-target w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${config.buttonColor}`}
                >
                  Back to Home
                </motion.button>
              )}
              {status === 'processing' && (
                <div className="text-center text-slate-300 text-sm">
                  Do not close this window...
                </div>
              )}
            </div>

            {/* Auto-close indicator for successful */}
            {status === 'successful' && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-bl-2xl"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
