import { createContext, useContext, useState, ReactNode } from 'react';

interface AnimationContextType {
  isAuthAnimating: boolean;
  setAuthAnimating: (animating: boolean) => void;
  isLogoutAnimating: boolean;
  setLogoutAnimating: (animating: boolean) => void;
  isLogoutLoading: boolean;
  setLogoutLoading: (loading: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [isAuthAnimating, setAuthAnimating] = useState(false);
  const [isLogoutAnimating, setLogoutAnimating] = useState(false);
  const [isLogoutLoading, setLogoutLoading] = useState(false);

  return (
    <AnimationContext.Provider value={{ isAuthAnimating, setAuthAnimating, isLogoutAnimating, setLogoutAnimating, isLogoutLoading, setLogoutLoading }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
}
