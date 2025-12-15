import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ClipboardDocumentListIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { type RootState } from "../../store";
import { motion } from "framer-motion";
import { AccountSidebar } from "../../components/Layout/AccountSidebar";
import { BackButton } from "../../components/UI/BackButton";
import TargetCursor from "../../components/Layout/TargetCursor";

interface Transaction {
  id: string;
  type: "booking" | "refund" | "promotion";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
  bookingRef?: string;
}

export default function TransactionsPage() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [transactions] = useState<Transaction[]>(() => {
    if (!user) {
      navigate("/auth");
      return [];
    }

    const mockTransactions: Transaction[] = [
      {
        id: "TXN001",
        type: "booking",
        description: "The Dark Knight - 2 tickets",
        amount: 25.99,
        date: "2025-01-10",
        status: "completed",
        paymentMethod: "Visa ending in 4242",
        bookingRef: "BK001",
      },
      {
        id: "TXN002",
        type: "booking",
        description: "Inception - 3 tickets",
        amount: 38.97,
        date: "2025-01-08",
        status: "completed",
        paymentMethod: "Mastercard ending in 5555",
        bookingRef: "BK002",
      },
      {
        id: "TXN003",
        type: "refund",
        description: "Refund for Avatar booking",
        amount: -13.99,
        date: "2024-12-26",
        status: "completed",
        paymentMethod: "Original payment method",
        bookingRef: "BK003",
      },
      {
        id: "TXN004",
        type: "promotion",
        description: "Promotion discount code applied",
        amount: -5.0,
        date: "2025-01-05",
        status: "completed",
        paymentMethod: "Promo credit",
        bookingRef: "BK004",
      },
      {
        id: "TXN005",
        type: "booking",
        description: "Interstellar - 2 tickets",
        amount: 27.98,
        date: "2025-01-03",
        status: "completed",
        paymentMethod: "PayPal",
        bookingRef: "BK005",
      },
      {
        id: "TXN006",
        type: "booking",
        description: "Oppenheimer - 1 ticket",
        amount: 13.99,
        date: "2025-01-01",
        status: "pending",
        paymentMethod: "Visa ending in 4242",
        bookingRef: "BK006",
      },
    ];
    return mockTransactions;
  });
  const [filter, setFilter] = useState<"all" | "booking" | "refund" | "promotion">("all");

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const statusConfig = {
    completed: {
      bg: "bg-green-500/20",
      border: "border-green-400/50",
      text: "text-green-300",
      label: "Completed",
      icon: CheckCircleIcon,
    },
    pending: {
      bg: "bg-yellow-500/20",
      border: "border-yellow-400/50",
      text: "text-yellow-300",
      label: "Pending",
      icon: ClipboardDocumentListIcon,
    },
    failed: {
      bg: "bg-red-500/20",
      border: "border-red-400/50",
      text: "text-red-300",
      label: "Failed",
      icon: XCircleIcon,
    },
  };

  const typeConfig = {
    booking: {
      label: "Booking",
      color: "text-blue-300",
      icon: ArrowDownIcon,
    },
    refund: {
      label: "Refund",
      color: "text-green-300",
      icon: ArrowUpIcon,
    },
    promotion: {
      label: "Promotion",
      color: "text-pink-300",
      icon: ArrowUpIcon,
    },
  };

  const totalSpent = transactions
    .filter((t) => t.status === "completed" && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = transactions
    .filter((t) => t.status === "completed" && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <motion.div
      className="min-h-screen px-4 sm:px-6 lg:px-8 pt-16 pb-8"
      style={{
        backgroundImage: "linear-gradient(135deg, #221824 0%, #5a314b 30%, #b14f4a 60%, #f28b6b 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <TargetCursor targetSelector="button, a[role='button'], [role='button'], .btn, .button, [class*='btn'], [class*='button'], .shiny-cta, .shiny-cta-link, .cursor-target" spinDuration={2} hideDefaultCursor={true} hoverDuration={0.2} parallaxOn={true} />
      {/* Animated background elements - glowing embers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ backgroundImage: "linear-gradient(to bottom right, rgba(242, 139, 107, 0.4), rgba(177, 79, 74, 0.4))" }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" style={{ backgroundImage: "linear-gradient(to bottom right, rgba(177, 79, 74, 0.4), rgba(90, 49, 75, 0.4))" }}></div>
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
              <div className="relative px-6 py-8" style={{ backgroundImage: "linear-gradient(to right, #5a314b, #b14f4a, #f28b6b)" }}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center gap-3">
                  <ClipboardDocumentListIcon className="w-8 h-8 text-white" />
                  <h1 className="text-3xl font-title font-bold text-white">
                    Transaction History
                  </h1>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 sm:p-8 border-b border-white/10">
                <div className="rounded-lg p-5 border" style={{ backgroundColor: "rgba(242, 139, 107, 0.15)", borderColor: "rgba(242, 139, 107, 0.5)" }}>
                  <p className="text-amber-100 text-sm mb-2 font-label">Total Spent</p>
                  <p className="text-3xl sm:text-4xl font-title font-bold" style={{ color: "#f28b6b" }}>
                    ${totalSpent.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg p-5 border" style={{ backgroundColor: "rgba(177, 79, 74, 0.15)", borderColor: "rgba(177, 79, 74, 0.5)" }}>
                  <p className="text-amber-100 text-sm mb-2 font-label">Total Refunded</p>
                  <p className="text-3xl sm:text-4xl font-title font-bold" style={{ color: "#b14f4a" }}>
                    ${totalRefunds.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="px-6 sm:px-8 py-5 border-b border-white/10 flex flex-wrap gap-2">
                {(["all", "booking", "refund", "promotion"] as const).map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`btn px-4 py-2 rounded-lg transition-all duration-200 text-sm font-button font-medium ${
                        filter === f
                          ? "bg-pink-500/40 border border-pink-400/50 text-white"
                          : "bg-white/5 border border-white/10 text-indigo-100 hover:bg-white/10"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  )
                )}
              </div>

              {/* Transactions List */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-h-full overflow-y-auto custom-scrollbar">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardDocumentListIcon className="w-16 h-16 text-indigo-300 mx-auto mb-4 opacity-50" />
                    <p className="text-indigo-100 text-lg font-body">
                      No {filter !== "all" ? filter : ""} transactions found.
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction, index) => {
                    const statusInfo =
                      statusConfig[transaction.status as keyof typeof statusConfig];
                    const typeInfo =
                      typeConfig[transaction.type as keyof typeof typeConfig];
                    const StatusIcon = statusInfo.icon;
                    const TypeIcon = typeInfo.icon;

                    return (
                      <motion.div
                        key={transaction.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <TypeIcon
                                className={`w-5 h-5 ${typeInfo.color}`}
                              />
                              <h3 className="text-white font-title font-semibold text-base">
                                {transaction.description}
                              </h3>
                              <div
                                className={`${statusInfo.bg} ${statusInfo.border} border rounded-full px-2 py-0.5 flex items-center gap-1`}
                              >
                                <StatusIcon
                                  className={`w-3 h-3 ${statusInfo.text}`}
                                />
                                <span
                                  className={`text-xs font-semibold ${statusInfo.text}`}
                                >
                                  {statusInfo.label}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-indigo-200 space-y-1 font-body">
                              <p>Date: {transaction.date}</p>
                              <p>Method: {transaction.paymentMethod}</p>
                              {transaction.bookingRef && (
                                <p>Ref: {transaction.bookingRef}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p
                              className={`text-lg font-bold ${
                                transaction.amount > 0
                                  ? "text-red-300"
                                  : "text-green-300"
                              }`}
                            >
                              {transaction.amount > 0 ? "-" : "+"}$
                              {Math.abs(transaction.amount).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
