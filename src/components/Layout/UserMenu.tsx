import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  TicketIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "@heroui/react";
import { type RootState } from "../../store";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { useLogout } from "../../hooks/useLogout";
import { useAnimation } from "../../contexts/AnimationContext";
import TargetCursor from "./TargetCursor";

/**
 * UserMenu - Dropdown menu component for user profile and actions
 * Displays user info and provides quick access to account pages and logout
 */
export function UserMenu() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isLogoutLoading } = useAnimation();
  const { executeLogout, cleanup } = useLogout();

  // Close menu when clicking outside
  useOutsideClick(menuRef as React.RefObject<HTMLDivElement>, () => setIsOpen(false));

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  if (!user) {
    return null;
  }

  const displayName = user.name
    ? user.name.split(" ")[0]
    : user.email
      ? user.email.split("@")[0]
      : "User";

  const handleLogout = async () => {
    // Reset cursor position by dispatching a mousemove event to center of screen
    // This prevents the cursor from lingering at the logout button position
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const mouseMoveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: centerX,
      clientY: centerY,
    });
    document.dispatchEvent(mouseMoveEvent);
    
    setIsOpen(false);
    await executeLogout();
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Menu Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-600/30 transition-all duration-200 text-white"
          aria-label="User menu"
          aria-expanded={isOpen}
          disabled={isLogoutLoading}
        >
          <Avatar
            name={displayName}
            size="sm"
            icon={<UserCircleIcon className="h-4 w-4" />}
            className="flex-shrink-0"
          />
          <span className="text-sm hidden sm:inline truncate max-w-[100px]">
            {displayName}
          </span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl backdrop-blur-md bg-indigo-950/80 border border-white/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
            {/* Target Cursor for menu items - key changes when menu closes to reset animation */}
            <TargetCursor 
              key={`cursor-${isOpen}`}
              targetSelector="a, button" 
              spinDuration={2} 
              hideDefaultCursor={false} 
              hoverDuration={0.2} 
              parallaxOn={true} 
            />
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
              <p className="text-xs text-indigo-300 font-semibold">Logged in as</p>
              <p className="text-sm font-bold text-white truncate">{user.email}</p>
              {user.name && (
                <p className="text-xs text-indigo-200 mt-1">{user.name}</p>
              )}
              {user.tierPoint !== undefined && (
                <p className="text-xs text-yellow-300 mt-2 flex items-center gap-1">
                  ⭐ {user.tierPoint?.toLocaleString()} points
                </p>
              )}
            </div>

            {/* Menu Items */}
            <nav className="py-2">
              <Link
                to="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors text-sm"
              >
                <UserCircleIcon className="w-4 h-4 flex-shrink-0 text-pink-400" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/account/bookings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors text-sm"
              >
                <TicketIcon className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span>My Bookings</span>
              </Link>

              <Link
                to="/account/transactions"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors text-sm"
              >
                <ClipboardDocumentListIcon className="w-4 h-4 flex-shrink-0 text-purple-400" />
                <span>Transactions</span>
              </Link>
            </nav>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-300 hover:bg-red-500/10 transition-colors text-sm font-medium border-t border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftOnRectangleIcon className="w-4 h-4 flex-shrink-0" />
              <span>{isLogoutLoading ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
