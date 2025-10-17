import React, { useEffect } from "react";

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