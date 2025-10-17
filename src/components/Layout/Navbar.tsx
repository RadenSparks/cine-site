import  { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FilmIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Button, Avatar , Breadcrumbs } from "@heroui/react";
import { type RootState } from "../../store";
import { logout } from "../../store/authSlice";
import { cn } from "../../lib/utils";

export default function AppNavbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();

  // Breadcrumbs based on location
  const crumbs = [
    { label: "Home", href: "/" },
    ...(location.pathname !== "/"
      ? [{ label: location.pathname.replace("/", ""), href: location.pathname }]
      : []),
  ];

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 mx-auto max-w-5xl", className)}>
      <nav className="relative flex items-center justify-between px-8 py-4 rounded-b-2xl bg-gradient-to-r from-indigo-900 via-indigo-700 to-pink-900 shadow-xl backdrop-blur-lg border-b border-pink-500/30">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-white hover:scale-105 transition-transform">
          <FilmIcon className="h-8 w-8 text-pink-400 drop-shadow" />
          CineSite
        </Link>

        {/* Menu */}
        <div className="flex gap-8 text-lg">
          <MenuItem
            label="Home"
            to="/"
            active={active === "Home"}
            setActive={(value) => setActive(value ?? "Home")}
          />
          <MenuItem
            label="Movies"
            to="/categories"
            active={active === "Movies"}
            setActive={(value) => setActive(value ?? "Movies")}
          />
          <MenuItem
            label="News"
            to="/news"
            active={active === "News"}
            setActive={(value) => setActive(value ?? "News")}
          />
          <MenuItem
            label="Promotions"
            to="/gift"
            active={active === "Promotions"}
            setActive={(value) => setActive(value ?? "Promotions")}
          />
        </div>

        {/* User Menu */}
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar name={user.email} icon={<UserCircleIcon className="h-8 w-8" />} />
              <span className="text-sm text-white">{user.email}</span>
              <Button color="danger" size="sm" className="shadow-md" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            </div>
          ) : (
            // point Login button to /auth so it opens the unified auth page
            <Button color="primary" as={Link} to="/auth" className="shadow-md">
              Login
            </Button>
          )}
        </div>
      </nav>
      {/* Optional: Add a subtle divider or shadow */}
      <div className="h-2 bg-gradient-to-r from-pink-500/30 via-indigo-700/30 to-indigo-900/30 rounded-b-2xl"></div>
      <div className="container mx-auto px-4 py-2">
        <Breadcrumbs>
          {crumbs.map((crumb) => (
            <Link key={crumb.href} to={crumb.href}>
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      </div>
    </div>
  );
}

// MenuItem with hover effect
function MenuItem({
  label,
  to,
  active,
  setActive,
}: {
  label: string;
  to: string;
  active: boolean;
  setActive: (value?: string | null) => void;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "relative px-3 py-1 rounded transition-all duration-200",
        active
          ? "bg-pink-500/30 text-white shadow-lg"
          : "text-white/80 hover:bg-indigo-700/40 hover:text-white"
      )}
      onMouseEnter={() => setActive(label)}
      onMouseLeave={() => setActive(null)}
    >
      {label}
      {active && (
        <span className="absolute left-0 right-0 -bottom-1 h-1 bg-pink-400 rounded-full blur-sm opacity-70"></span>
      )}
    </Link>
  );
}