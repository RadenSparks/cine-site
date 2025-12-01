import  { useState } from "react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FilmIcon } from "@heroicons/react/24/outline";
import { Breadcrumbs } from "@heroui/react";
import { type RootState } from "../../store";
import { cn } from "../../lib/utils";
import TargetCursor from "./TargetCursor";
import { UserMenu } from "./UserMenu";
import "./Navbar.css";

export default function AppNavbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  // Breadcrumbs based on location
  const crumbs = [
    { label: "Home", href: "/" },
    ...(location.pathname !== "/"
      ? [{ label: location.pathname.replace("/", ""), href: location.pathname }]
      : []),
  ];

  return (
    <>
      <TargetCursor targetSelector="button, a[role='button'], [role='button'], .btn, .button, [class*='btn'], [class*='button'], .shiny-cta, .shiny-cta-link, .cursor-target" spinDuration={2} hideDefaultCursor={true} hoverDuration={0.2} parallaxOn={true} />
      <header className={cn("fixed top-0 left-0 right-0 z-60", className)}>
      <nav className="navbar-nav mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between px-3 md:px-6 py-3 md:py-4 gap-3 sm:gap-0 bg-gradient-to-r from-indigo-900 via-indigo-700 to-pink-900 shadow-xl backdrop-blur-lg border-b border-pink-500/30 rounded-b-2xl">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg md:text-2xl text-white hover:scale-105 transition-transform flex-shrink-0">
          <FilmIcon className="h-6 md:h-8 w-6 md:w-8 text-pink-400 drop-shadow" />
          <span className="hidden sm:inline">CineSite</span>
        </Link>

        {/* Menu */}
        <div className="flex gap-2 md:gap-8 text-xs md:text-lg flex-wrap justify-center sm:justify-start">
          <MenuItem
            label="Home"
            to="/"
            active={active === "Home"}
            setActive={(value) => setActive(value ?? "Home")}
          />
          <MenuItem
            label="Movies"
              to="/movies"
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
        <div className="w-full sm:w-auto">
          {user ? (
            <div className="flex items-center gap-2 md:gap-3 justify-center sm:justify-end flex-wrap">
              <UserMenu />
            </div>
          ) : (
            <Link to="/auth" className="navbar-login-btn w-full sm:w-auto text-center">
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Breadcrumbs with adjusted container */}
      <div className="mx-auto max-w-7xl px-6 py-2">
        <Breadcrumbs>
          {crumbs.map((crumb) => (
            <Link key={crumb.href} to={crumb.href} className="text-white/70 hover:text-white">
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      </div>
    </header>
    </>
  );
}

// MenuItem with hover effect and cursor target
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
      role="button"
      className={cn(
        "btn relative px-2 md:px-3 py-1 rounded transition-all duration-200 whitespace-nowrap",
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