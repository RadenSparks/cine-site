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
          className="btn flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-white font-button text-sm md:text-base font-bold"
          style={{
            backgroundColor: "rgba(185, 28, 28, 0.2)",
            border: "1px solid #ea580c",
            hover: { backgroundColor: "rgba(234, 88, 12, 0.3)" }
          }}
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
          <span className="text-sm hidden sm:inline truncate max-w-[100px] font-bold text-white">
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
          <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl backdrop-blur-md border border-orange-500/30 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2" style={{ backgroundColor: "rgba(2, 6, 23, 0.95)", backgroundImage: "linear-gradient(135deg, rgba(2, 6, 23, 0.9) 0%, rgba(31, 41, 51, 0.85) 100%)" }}>
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
            <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(234, 88, 12, 0.3)", backgroundImage: "linear-gradient(to right, rgba(185, 28, 28, 0.15), rgba(234, 88, 12, 0.1))" }}>
              <p className="text-xs font-button font-bold text-orange-400">Logged in as</p>
              <p className="text-sm font-title font-bold text-white truncate">{user.email}</p>
              {user.name && (
                <p className="text-xs font-body text-orange-200/80 mt-1">{user.name}</p>
              )}
              {user.tierPoint !== undefined && (
                <p className="text-xs font-button text-orange-300 mt-2 flex items-center gap-1 font-bold">
                  ⭐ {user.tierPoint?.toLocaleString()} points
                </p>
              )}
            </div>

            {/* Menu Items */}
            <nav className="py-2">
              <Link
                to="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-orange-500/15 transition-colors text-sm font-button font-bold"
              >
                <UserCircleIcon className="w-4 h-4 flex-shrink-0 text-orange-400" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/account/bookings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-orange-500/15 transition-colors text-sm font-button font-bold"
              >
                <TicketIcon className="w-4 h-4 flex-shrink-0 text-orange-400" />
                <span>My Bookings</span>
              </Link>

              <Link
                to="/account/transactions"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-orange-500/15 transition-colors text-sm font-button font-bold"
              >
                <ClipboardDocumentListIcon className="w-4 h-4 flex-shrink-0 text-orange-400" />
                <span>Transactions</span>
              </Link>
            </nav>

            {/* Divider */}
            <div className="h-px" style={{ backgroundImage: "linear-gradient(to right, transparent, rgba(234, 88, 12, 0.3), transparent)" }} />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-orange-600/20 transition-colors text-sm font-button font-bold border-t disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "rgba(234, 88, 12, 0.2)" }}
            >
              <ArrowLeftOnRectangleIcon className="w-4 h-4 flex-shrink-0 text-orange-400" />
              <span>{isLogoutLoading ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
