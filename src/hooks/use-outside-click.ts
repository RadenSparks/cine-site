import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: (event: MouseEvent | TouchEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: unknown) => {
      const target = (event as MouseEvent | TouchEvent).target as Node | null;
      if (!ref.current || (target && ref.current.contains(target))) {
        return;
      }
      callback(event as MouseEvent | TouchEvent);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};

// Authentication hook for route protection and login checks
export const useAuth = () => {
  const user = useSelector((state: { auth: { user: unknown } }) => state.auth.user);
  const isAuthenticated = user !== null;
  return { user, isAuthenticated };
};