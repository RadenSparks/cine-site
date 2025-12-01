import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../../store";
import { fetchProfileAsync } from "../../store/authSlice";

export function UserBadge() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch fresh profile data on mount or when access token changes
  useEffect(() => {
    if (user?.accessToken && !user?.name) {
      // User is logged in but doesn't have full profile data
      dispatch(fetchProfileAsync()).catch((error) => {
        // Silently fail - user can still use the app
        console.debug('Profile fetch failed:', error);
      });
    }
  }, [user?.accessToken, dispatch]);

  if (!user) {
    return null;
  }

  // Display user name if available, otherwise fall back to email prefix
  const displayName = user.name ? user.name.split(" ")[0] : (user.email ? user.email.split("@")[0] : "User");

  return (
    <Link
      to="/account"
      className="btn flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-indigo-600/30 transition-all duration-200"
      title={user.email}
    >
      <Avatar
        name={displayName}
        size="sm"
        icon={<UserCircleIcon className="h-4 md:h-5 w-4 md:w-5" />}
        className="flex-shrink-0"
      />
      <span className="text-xs md:text-sm text-white hidden sm:inline truncate max-w-[150px]">
        {displayName}
      </span>
    </Link>
  );
}
