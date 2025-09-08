import React from "react";

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-pink-900 to-indigo-700">
      {/* Aurora effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/4 top-1/4 w-[60vw] h-[60vw] bg-pink-500 opacity-30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 w-[40vw] h-[40vw] bg-indigo-500 opacity-30 blur-2xl rounded-full animate-pulse" />
        <div className="absolute left-1/2 top-1/2 w-[30vw] h-[30vw] bg-purple-700 opacity-20 blur-2xl rounded-full animate-pulse" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}