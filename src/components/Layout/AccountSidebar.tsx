import { Link, useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  TicketIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { cn } from "../../lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isLogout?: boolean;
}

export function AccountSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();

  const navItems: NavItem[] = [
    {
      label: "Profile",
      href: "/account",
      icon: <UserCircleIcon className="w-5 h-5" />,
    },
    {
      label: "My Bookings",
      href: "/account/bookings",
      icon: <TicketIcon className="w-5 h-5" />,
    },
    {
      label: "Transaction History",
      href: "/account/transactions",
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="backdrop-blur-sm bg-white/10 shadow-lg rounded-2xl border border-white/20 overflow-hidden">
        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "btn flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                location.pathname === item.href
                  ? "bg-gradient-to-r from-pink-500/40 to-purple-500/40 text-white border border-pink-400/50"
                  : "text-indigo-100 hover:bg-white/10 hover:text-white border border-transparent"
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="btn w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/40 hover:bg-red-500/60 text-white rounded-lg transition-all duration-200 border border-red-400/30 hover:border-red-400/60 font-button font-medium"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
